import User from "../model/userModel.js";
import Order from "../model/orderModel.js";
import Product from "../model/productModel.js";

export const placeOrder=  async(req, res)=>{

try{
   
const {items,address,paymentMethod}= req.body
const userId= req.userId

if (!Array.isArray(items) || items.length === 0) {
  return res.status(400).json({message:"Cart is empty"})
}

if (!address || !paymentMethod) {
  return res.status(400).json({message:"Address and payment method are required"})
}

let amount = 0
const orderItems = []

for (const item of items) {
  const quantity = Number(item.quantity)

  if (!item._id || !quantity || quantity <= 0) {
    return res.status(400).json({message:"Invalid order item"})
  }

  const product = await Product.findById(item._id)

  if (!product) {
    return res.status(404).json({message:"Product not found"})
  }

  if (item.selectedSize && !product.sizes.includes(item.selectedSize)) {
    return res.status(400).json({message:"Invalid product size"})
  }

  amount += product.price * quantity
  orderItems.push({
    _id: product._id,
    name: product.name,
    image1: product.image1,
    price: product.price,
    category: product.category,
    selectedSize: item.selectedSize,
    quantity,
  })
}

const order= await Order.create({items:orderItems,amount,address,paymentMethod,userId})


await User.findByIdAndUpdate(userId,{cartData:{}})
 return res.status(201).json({message:"Order Placed successfully ",order:order});

}catch(error){

console.log("Placeorder error");

  return res.status(500).json({message:`Placeorder error ${error}`});
}

 }


export const userOrder= async(req,res)=>{
   
   try {
    const userId= req.userId;

const userOrder= await  Order.find({userId});

 return res.status(200).json({message:"userOrder Placed successfully ",orders:userOrder});

   } catch (error) {

console.log("UserOrder error");

  return res.status(500).json({message:`UserOrder error ${error}`});
   }

}
export const allorders= async(req,res)=>{
  try{
const allOrder= await Order.find({})
 return res.status(200).json({message:" Allorders successfully ",allOrder});

  }catch(error){
console.log("Allorders error");

  return res.status(500).json({message:`Allorders error ${error}`});
  }
}



export const updateStatus= async (req,res)=>{
  try{
    const {orderId,status}= req.body;

    const order = await Order.findById(orderId)
    
    if(!order){
      return res.status(404).json({message:"Order Does Not Exits"})
    }
const allowedStatus = ["Order Placed","Packing","Shipped","Out for delivery","Delivered"]

if (!allowedStatus.includes(status)) {
  return res.status(400).json({ message: "Invalid order status" })
}
order.status=status
 await order.save()

        return res.status(200).json({message:"Status Changed"})


  }catch(error){
console.log("upadte order error");

  return res.status(500).json({message:`UpdateOrder error ${error}`});
  }
}
