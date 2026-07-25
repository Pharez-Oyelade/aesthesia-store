import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, default: "waitlist" },
  code: { type: String, required: false },
  usageType: {
    type: String,
    enum: ["single-use", "multi-use"],
    default: "single-use",
  },
  usageCount: { type: Number, default: 0 },
  status: { type: String, required: true, default: "active" },
  subscriberLimit: { type: Number, required: false },
  subscriberCount: { type: Number, required: true, default: 0 },
  discountType: { type: String, required: true, default: "percentage" },
  discountValue: { type: Number, required: true, default: 0 },
  discountScope: {
    type: String,
    enum: ["all", "collection", "product"],
    required: true,
    default: "all",
  },
  eligibleCollections: {
    type: [String],
    default: [],
  },
  eligibleProducts: {
    type: [String],
    default: [],
  },
  codePrefix: { type: String, required: true, default: "AEST" },
  startsAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
  subscriptionStartsAt: { type: Date, required: false },
  subscriptionEndsAt: { type: Date, required: false },
  discountStartsAt: { type: Date, required: false },
  discountExpiresAt: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const campaignModel =
  mongoose.models.Campaign ||
  mongoose.model("Campaign", campaignSchema, "campaigns");

export default campaignModel;
