
import express from 'express'
import { addProduct, listProducts, removeProduct,singleProduct, updateProduct } from '../controller/productController.js';

import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js"
const productRoutes=express.Router();



productRoutes.post("/addproduct",adminAuth,upload.fields([
    {name:"image1",maxCount:1},
    {name:"image2",maxCount:1},
    {name:"image3",maxCount:1},
    {name:"image4",maxCount:1}]),addProduct)


productRoutes.get("/list",listProducts);
productRoutes.post("/update/:id",adminAuth,updateProduct);
productRoutes.post("/remove/:id",adminAuth,removeProduct);
productRoutes.get("/:id", singleProduct)

export default productRoutes; 

