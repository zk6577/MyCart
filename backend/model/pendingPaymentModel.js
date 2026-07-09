import mongoose from "mongoose";

const pendingPaymentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },
    razorpayOrderId: {
      type: String,
      required: true,
      unique: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    amountInPaise: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      required: true,
      default: "INR",
    },
    receipt: {
      type: String,
      required: true,
    },
    items: {
      type: Array,
      required: true,
    },
    address: {
      type: Object,
      required: true,
    },
    status: {
      type: String,
      enum: ["created", "verified"],
      default: "created",
    },
    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

pendingPaymentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PendingPayment = mongoose.model("PendingPayment", pendingPaymentSchema);

export default PendingPayment;
