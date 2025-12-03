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
import optionalAuth from "../middleware/optionalAuth.js";

const orderRouter = express.Router();

// Admin features
orderRouter.post("/list", adminAuth, allOrders); // Route for getting all orders for admin
orderRouter.post("/status", adminAuth, updateStatus);

// Payment Features - Allow both authenticated and guest users
orderRouter.post("/place", optionalAuth, placeOrder);
orderRouter.post("/paystack", optionalAuth, placeOrderPaystack);

// User Feature - Only authenticated users can view their orders
orderRouter.post("/userorders", authUser, userOrders);

export default orderRouter;
