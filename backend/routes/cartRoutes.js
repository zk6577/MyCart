import express from "express"
import isAuth from "../middleware/isAuth.js"
import { addCart, getCart, updateCart } from "../controller/cartController.js"

const cartRoutes = express.Router()


cartRoutes.get("/get",isAuth,getCart);
cartRoutes.post("/add",isAuth,addCart);
cartRoutes.post("/update",isAuth,updateCart);

export default cartRoutes
