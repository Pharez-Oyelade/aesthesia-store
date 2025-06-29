import express from "express";
import {
  addToWishlist,
  getUserWishlist,
} from "../controllers/wishController.js";
import authUser from "../middleware/auth.js";

const wishlistRouter = express.Router();

// add products to wishlist
wishlistRouter.post("/add", authUser, addToWishlist);

// Route to get wishlist data
wishlistRouter.post("/get", authUser, getUserWishlist);

export default wishlistRouter;
