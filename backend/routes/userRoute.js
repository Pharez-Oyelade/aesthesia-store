import express from "express";
import {
  loginUser,
  registerUser,
  adminLogin,
  getUserDetails,
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

// Route for user login
userRouter.post("/login", loginUser);
// Route for user registration
userRouter.post("/register", registerUser);
// Route for admin login
userRouter.post("/admin", adminLogin);

// Route fetching user details
userRouter.post("/details", authUser, getUserDetails);

export default userRouter;
