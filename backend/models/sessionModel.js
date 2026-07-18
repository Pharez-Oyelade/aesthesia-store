import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    visitorId: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      default: null,
      index: true,
    },
    sessionId: {
      type: String,
      required: true,
      unique: true,
    },
    source: String,
    medium: String,
    campaign: String,
    referrer: String,
    landingPage: String,
    startedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true },
);

sessionSchema.index({ visitorId: 1, startedAt: 1 });

const Session = mongoose.model("Session", sessionSchema);

export default Session;
