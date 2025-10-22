import express from "express";
import {
  loginUser,
  registerUser,
  forgotPassword,
  resetPassword,
  adminLogin,
  getUserDetails,
  refreshToken,
  logoutUser,
} from "../controllers/userController.js";
import authUser from "../middleware/auth.js";

const userRouter = express.Router();

// Route for user login
userRouter.post("/login", loginUser);
// Route for user registration
userRouter.post("/register", registerUser);
// Route for admin login
userRouter.post("/admin", adminLogin);

userRouter.post("/forgot-password", forgotPassword);
userRouter.post("/reset-password", resetPassword);

userRouter.post("/refresh", refreshToken);
userRouter.post("/logout", authUser, logoutUser);

// Route fetching user details
userRouter.post("/details", authUser, getUserDetails);

export default userRouter;
