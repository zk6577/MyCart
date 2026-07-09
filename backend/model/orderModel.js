import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userId:{
        type :String,
        required:true,

    },
    items:{
        type:Array,
      required:true,
    },
    amount:{
        type:Number,
        required:true,
    },
        address: {
      type: Object,
      required: true,
    },

    status: {
      type: String,
      default: "Order Placed",
    },

    paymentMethod: {
      type: String,
      required: true,
    },

    payment: {
      type: Boolean,
      default: false,
    },
    paymentDetails: {
      type: Object,
      default: {},
    },
  },
  { timestamps: true }

)
orderSchema.index({ "paymentDetails.razorpayOrderId": 1 }, { unique: true, sparse: true });

const Order = mongoose.model("Order", orderSchema);


export default Order;
