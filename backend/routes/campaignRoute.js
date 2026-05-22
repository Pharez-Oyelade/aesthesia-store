import express from "express";
import {
  getActiveWaitlist,
  subscribeToWaitlist,
} from "../controllers/campaignController.js";

const campaignRouter = express.Router();

// Route to get active waitlist
campaignRouter.get("/active-waitlist", getActiveWaitlist);

// Route to subscribe to waitlist
campaignRouter.post("/subscribe/:id", subscribeToWaitlist);

export default campaignRouter;
