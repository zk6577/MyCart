import express, { Router } from "express";

import { allorders, placeOrder, updateStatus, userOrder } from "../controller/orderController.js";
import isAuth from "../middleware/isAuth.js";
import adminAuth from "../middleware/adminAuth.js";

const orderRoutes= express.Router()

orderRoutes.post("/place",isAuth,placeOrder)
orderRoutes.get("/userorders", isAuth, userOrder)
orderRoutes.get("/allOrders",adminAuth,allorders)
orderRoutes.post("/status",adminAuth,updateStatus)
export default orderRoutes;


