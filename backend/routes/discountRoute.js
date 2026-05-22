import express from "express";
import { validateDiscountCode } from "../controllers/discountController.js";

const discountRouter = express.Router();

discountRouter.post("/validate", validateDiscountCode);

export default discountRouter;
