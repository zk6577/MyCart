import express  from "express";
import { adminLogin, adminLogOut, googleLogin, login, logOut, register } from "../controller/authController.js";



const authRoutes= express.Router();


authRoutes.post("/register",register);

 authRoutes.post("/login",login);
 authRoutes.get("/logout",logOut);
 authRoutes.get("/adminlogout",adminLogOut);
authRoutes.post("/googlelogin",googleLogin)

authRoutes.post("/adminlogin",adminLogin)

export default authRoutes;
