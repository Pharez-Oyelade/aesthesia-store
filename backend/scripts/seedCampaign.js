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

  const existing = await campaignModel.findOne({
    type: "waitlist",
    status: "active",
  });

  if (existing) {
    console.log("Active waitlist campaign already exists:", existing._id);
    process.exit(0);
  }

  const campaign = await campaignModel.create({
    name: "Pre-Launch Waitlist",
    type: "waitlist",
    status: "active",
    subscriberLimit: 200,
    subscriberCount: 0,
    discountType: "percentage",
    discountValue: 15,
    discountScope: "collection",
    eligibleCollections: ["The RERE Collection"],
    codePrefix: "AEST",
    startsAt: new Date(),
    expiresAt: new Date("2026-12-31"),
    subscriptionStartsAt: new Date(),
    subscriptionEndsAt: new Date("2026-10-31"),
    discountStartsAt: new Date(),
    discountExpiresAt: new Date("2026-12-31"),
  });

  console.log("Campaign created:", campaign._id);
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});

// import mongoose from "mongoose";
// import campaignModel from "../models/campaignModel.js";
// import dns from "dns";
// dns.setDefaultResultOrder("ipv4first");

// const seed = async () => {
//   const mongoUrl = process.argv[2];

//   if (!mongoUrl) {
//     console.error("Please provide MongoDB URL as argument");
//     process.exit(1);
//   }

//   await mongoose.connect(mongoUrl);
//   console.log("Connected to MongoDB");

//   const existing = await campaignModel.findOne({
//     type: "waitlist",
//     status: "active",
//   });

//   if (existing) {
//     console.log("Active waitlist campaign already exists:", existing._id);
//     process.exit(0);
//   }

//   const campaign = await campaignModel.create({
//     name: "Pre-Launch Waitlist",
//     type: "waitlist",
//     status: "active",
//     subscriberLimit: 200,
//     subscriberCount: 0,
//     discountType: "percentage",
//     discountValue: 15,
//     codePrefix: "AEST",
//     startsAt: new Date(),
//     expiresAt: new Date("2025-12-31"),
//   });

//   console.log("Campaign created:", campaign._id);
//   process.exit(0);
// };

// seed().catch((err) => {
//   console.error(err);
//   process.exit(1);
// });
