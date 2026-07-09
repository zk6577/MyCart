import express from "express";
import { deleteMessage, getMessages, sendContactMessage, updateMessageStatus } from "../controller/contactController.js";
import adminAuth from "../middleware/adminAuth.js";
const contactRoutes = express.Router();

contactRoutes.post("/send", sendContactMessage);
contactRoutes.get("/allmsg",adminAuth,getMessages)
contactRoutes.post("/status/:id",adminAuth,updateMessageStatus)
contactRoutes.post("/delete/:id",adminAuth,deleteMessage)
export default contactRoutes;
