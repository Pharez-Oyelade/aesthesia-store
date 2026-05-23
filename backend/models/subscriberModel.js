import mongoose from "mongoose";

const subscriberSchema = new mongoose.Schema({
  campaignId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Campaign",
    required: true,
  },
  email: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  status: { type: String, required: true, default: "active" },
  usedAt: { type: Date, required: false },
  createdAt: { type: Date, default: Date.now },
});

const subscriberModel =
  mongoose.models.subscriber || mongoose.model("subscriber", subscriberSchema);

export default subscriberModel;
