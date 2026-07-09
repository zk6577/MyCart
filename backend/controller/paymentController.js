import crypto from "crypto";
import Razorpay from "razorpay";
import Order from "../model/orderModel.js";
import PendingPayment from "../model/pendingPaymentModel.js";
import Product from "../model/productModel.js";
import User from "../model/userModel.js";

const MIN_AMOUNT_IN_PAISE = 100;
const PAYMENT_SESSION_TTL_MS = 30 * 60 * 1000;
const REQUIRED_ADDRESS_FIELDS = ["fullName", "phone", "street", "city", "state", "pincode"];

const getRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    throw new Error("Razorpay credentials are missing");
  }

  return new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET,
  });
};

const buildOrderItems = async (items) => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error("Cart is empty");
  }

  let amount = 0;
  const orderItems = [];

  for (const item of items) {
    const quantity = Number(item.quantity);

    if (!item._id || !quantity || quantity <= 0) {
      throw new Error("Invalid order item");
    }

    const product = await Product.findById(item._id);

    if (!product) {
      throw new Error("Product not found");
    }

    if (item.selectedSize && !product.sizes.includes(item.selectedSize)) {
      throw new Error("Invalid product size");
    } 


    

    amount += product.price * quantity;
    orderItems.push({
      _id: product._id,
      name: product.name,
      image1: product.image1,
      price: product.price,
      category: product.category,
      selectedSize: item.selectedSize,
      quantity,
    });
  }

  return { amount, orderItems };
};

const normalizeAddress = (address) => {
  if (!address || typeof address !== "object" || Array.isArray(address)) {
    return null;
  }

  const normalizedAddress = {};

  for (const field of REQUIRED_ADDRESS_FIELDS) {
    const value = String(address[field] || "").trim();

    if (!value) {
      return null;
    }

    normalizedAddress[field] = value;
  }

  return normalizedAddress;
};

export const createRazorpayOrder = async (req, res) => {
  try {
    const { amount, currency = "INR", receipt, items, address } = req.body;
    const amountInPaise = Number(amount);
    const normalizedAddress = normalizeAddress(address);

    if (!Number.isInteger(amountInPaise) || amountInPaise < MIN_AMOUNT_IN_PAISE) {
      return res.status(400).json({ message: "Amount must be at least 100 paise" });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Items are required" });
    }

    if (!normalizedAddress) {
      return res.status(400).json({ message: "Complete delivery address is required" });
    }

    const { amount: calculatedAmount, orderItems } = await buildOrderItems(items);
    const calculatedAmountInPaise = Math.round(calculatedAmount * 100);

    if (calculatedAmountInPaise !== amountInPaise) {
      return res.status(400).json({ message: "Order amount does not match cart total" });
    }

    const razorpay = getRazorpay();
    const orderReceipt = receipt || `receipt_${Date.now()}`;
    const order = await razorpay.orders.create({
      amount: amountInPaise,
      currency,
      receipt: orderReceipt,
    });

    await PendingPayment.create({
      userId: req.userId,
      razorpayOrderId: order.id,
      amount: calculatedAmount,
      amountInPaise: order.amount,
      currency: order.currency,
      receipt: order.receipt || orderReceipt,
      items: orderItems,
      address: normalizedAddress,
      expiresAt: new Date(Date.now() + PAYMENT_SESSION_TTL_MS),
    });

    return res.status(201).json({
      order_id: order.id,
      amount: order.amount,
      currency: order.currency,
    });
  } catch (error) {
    console.log("Create Razorpay order error", error);

    if (error.statusCode === 401) {
      return res.status(401).json({ message: "Razorpay authentication failed" });
    }

    return res.status(500).json({ message: "Razorpay order could not be created" });
  }
};

export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_payment_id,
      razorpay_order_id,
      razorpay_signature,
    } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({ message: "Payment verification fields are required" });
    }

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ message: "Razorpay secret is missing" });
    }

    const generatedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const generatedBuffer = Buffer.from(generatedSignature);
    const receivedBuffer = Buffer.from(razorpay_signature);

    if (
      generatedBuffer.length !== receivedBuffer.length ||
      !crypto.timingSafeEqual(generatedBuffer, receivedBuffer)
    ) {
      return res.status(400).json({ message: "Invalid payment signature" });
    }

    const existingOrder = await Order.findOne({
      "paymentDetails.razorpayOrderId": razorpay_order_id,
    });

    if (existingOrder) {
      if (String(existingOrder.userId) !== String(req.userId)) {
        return res.status(403).json({ message: "Payment belongs to another user" });
      }

      return res.status(200).json({
        success: true,
        message: "Payment already verified",
        order: existingOrder,
      });
    }

    const pendingPayment = await PendingPayment.findOne({
      razorpayOrderId: razorpay_order_id,
      userId: req.userId,
      status: "created",
    });

    if (!pendingPayment) {
      return res.status(400).json({ message: "Payment session not found or expired" });
    }

    const razorpay = getRazorpay();
    const razorpayOrder = await razorpay.orders.fetch(razorpay_order_id);

    if (
      Number(razorpayOrder.amount) !== pendingPayment.amountInPaise ||
      razorpayOrder.currency !== pendingPayment.currency ||
      Number(razorpayOrder.amount_paid || 0) < pendingPayment.amountInPaise
    ) {
      return res.status(400).json({ message: "Razorpay order amount could not be verified" });
    }

    const order = await Order.create({
      userId: req.userId,
      items: pendingPayment.items,
      amount: pendingPayment.amount,
      address: pendingPayment.address,
      status: "Order Placed",
      paymentMethod: "Razorpay",
      payment: true,
      paymentDetails: {
        razorpayPaymentId: razorpay_payment_id,
        razorpayOrderId: razorpay_order_id,
        razorpaySignature: razorpay_signature,
      },
    });

    await PendingPayment.findByIdAndUpdate(pendingPayment._id, { status: "verified" });
    await User.findByIdAndUpdate(req.userId, { cartData: {} });

    return res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    if (error.code === 11000 && req.body?.razorpay_order_id) {
      const existingOrder = await Order.findOne({
        "paymentDetails.razorpayOrderId": req.body.razorpay_order_id,
      });

      if (existingOrder && String(existingOrder.userId) === String(req.userId)) {
        return res.status(200).json({
          success: true,
          message: "Payment already verified",
          order: existingOrder,
        });
      }
    }

    console.log("Verify Razorpay payment error", error);
    return res.status(500).json({ message: "Payment verification failed" });
  }
};
