import mongoose from "mongoose";
import campaignModel from "../models/campaignModel.js";
import dotenv from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({
  path: "C:/Users/USER/Desktop/projects/Aesthesia/aesthesia-store/backend/.env",
});

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URL);

  const campaign = await campaignModel.create({
    name: "The Haven — Exclusive Access",
    type: "promo",
    usageType: "single-use",
    status: "active",
    subscriberLimit: 50,
    subscriberCount: 0,
    discountType: "percentage",
    discountValue: 5,
    discountScope: "product",
    eligibleProducts: [],
    codePrefix: "HAVEN",
    startsAt: new Date(),
    expiresAt: new Date("2026-12-31"),
  });

  console.log("Promo Campaign created:", campaign._id);
  console.log(`Promo Link: /promo/${campaign._id}`);
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
