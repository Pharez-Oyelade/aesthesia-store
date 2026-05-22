import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, required: true, default: "waitlist" },
  status: { type: String, required: true, default: "active" },
  subscriberLimit: { type: Number, required: false },
  subscriberCount: { type: Number, required: true, default: 0 },
  discountType: { type: String, required: true, default: "percentage" },
  discountValue: { type: Number, required: true, default: 0 },
  codePrefix: { type: String, required: true, default: "AEST" },
  startsAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

const campaignModel =
  mongoose.models.campaign || mongoose.model("campaign", campaignSchema);

export default campaignModel;
