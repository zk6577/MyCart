
import dotenv from "dotenv";
dotenv.config();

import express from "express";
import connectDb from "./config/db.js";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import cors from "cors";
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";


const port = process.env.PORT || 5000;
const app = express();
const allowedOrigins = [
  process.env.FRONTEND_URL,
  process.env.ADMIN_URL,
  "http://localhost:5173",
  "http://localhost:5174",
].filter(Boolean);


app.use(express.json());
app.use(cookieParser());


app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials:true
}));
app.use("/api/auth",authRoutes);
app.use("/api/user",userRoutes);
app.use("/api/product",productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/order",orderRoutes);
app.use("/api/contact", contactRoutes);
app.use("/api", paymentRoutes);
const startServer = async () => {
  try {
    await connectDb();

    app.listen(port, () => {
    console.log(`Server is running at ${port}`);
    });
  } catch (error) {
    console.log("Server failed to start", error);
    process.exit(1);
  }
};

startServer();
