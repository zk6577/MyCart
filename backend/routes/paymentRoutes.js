import express from "express";
import { createRazorpayOrder, verifyPayment } from "../controller/paymentController.js";
import isAuth from "../middleware/isAuth.js";

const paymentRoutes = express.Router();

paymentRoutes.post("/create-order", isAuth, createRazorpayOrder);
paymentRoutes.post("/verify-payment", isAuth, verifyPayment);

export default paymentRoutes;
