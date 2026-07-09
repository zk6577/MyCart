


import express from "express";
import { getAdmin, getCurrentUser } from "../controller/userController.js";
import adminAuth from "../middleware/adminAuth.js";


const userRoutes=express.Router();



userRoutes.get("/getcurrentuser",getCurrentUser);

userRoutes.get("/getadmin",adminAuth,getAdmin);

export  default userRoutes;
