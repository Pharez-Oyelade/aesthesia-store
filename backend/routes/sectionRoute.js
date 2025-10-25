import express from "express";
import { addSection, listSections } from "../controllers/sectionController.js";
import upload from "../middleware/multer.js";
import adminAuth from "../middleware/adminAuth.js";

const sectionRouter = express.Router();

// Route for listing all sections
sectionRouter.get("/list", listSections);

// Route for adding a new section
sectionRouter.post(
  "/add-section",
  adminAuth,
  upload.fields([{ name: "bannerImage", maxCount: 1 }]),
  addSection
);

export default sectionRouter;
