import express from "express";
import {
  addToCart,
  getUserCart,
  updateCart,
} from "../controllers/cartController.js";
import authUser from "../middleware/auth.js";

const cartRouter = express.Router();

// Route to add products to user cart
cartRouter.post("/add", authUser, addToCart);

// Route to update products in user cart
cartRouter.post("/update", authUser, updateCart);

// Route to get user cart data
cartRouter.post("/get", authUser, getUserCart);

export default cartRouter;
