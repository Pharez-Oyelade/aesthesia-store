import express from "express";
import {
  placeOrder,
  placeOrderPaystack,
  allOrders,
  userOrders,
  updateStatus,
} from "../controllers/orderController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const orderRouter = express.Router();

// Admin features
orderRouter.post("/list", adminAuth, allOrders); // Route for getting all orders for admin
orderRouter.post("/status", adminAuth, updateStatus);

// Payment Features
orderRouter.post("/place", authUser, placeOrder);
orderRouter.post("/paystack", authUser, placeOrderPaystack);

// User Feature
orderRouter.post("/userorders", authUser, userOrders);

export default orderRouter;
