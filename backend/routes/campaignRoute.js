import express from "express";
import {
  getActiveWaitlist,
  subscribeToWaitlist,
  getPromo,
  claimPromo,
} from "../controllers/campaignController.js";

const campaignRouter = express.Router();

// Route to get active waitlist
campaignRouter.get("/active-waitlist", getActiveWaitlist);

// Route to subscribe to waitlist
campaignRouter.post("/subscribe/:id", subscribeToWaitlist);

campaignRouter.get("/promo/:id", getPromo);
campaignRouter.post("/promo/:id/claim", claimPromo);

export default campaignRouter;
