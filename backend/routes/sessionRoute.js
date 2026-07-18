import express from "express";
import {
  getConversionDetail,
  logSession,
  linkSession,
} from "../controllers/sessionController.js";
import adminAuth from "../middleware/adminAuth.js";
import authUser from "../middleware/auth.js";

const sessionRouter = express.Router();

sessionRouter.post("/log", logSession);
sessionRouter.post("/link", authUser, linkSession);
sessionRouter.get("/conversion/:orderId", adminAuth, getConversionDetail);

export default sessionRouter;
