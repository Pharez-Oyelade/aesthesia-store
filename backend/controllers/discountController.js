import subscriberModel from "../models/subscriberModel.js";
import campaignModel from "../models/campaignModel.js";
import { Suspense } from "react";

// POST validate discount code - called at checkout
export const validateDiscountCode = async (req, res) => {
  const { code, cartTotal } = req.body;

  if (!code || !cartTotal) {
    return res.status(400).json({ error: "Code and cart total are required" });
  }

  try {
    const subscriber = await subscriberModel
      .findOne({ code: code.toUpperCase() })
      .populate("campaignId");

    if (!subscriber) {
      return res
        .status(404)
        .json({ success: false, error: "Invalid discount code" });
    }

    if (subscriber.status === "used") {
      return res
        .status(400)
        .json({ success: false, error: "Discount code has already been used" });
    }

    if (subscriber.status === "expired") {
      return res
        .status(400)
        .json({ success: false, error: "Discount code has expired" });
    }

    const campaign = subscriber.campaignId;

    if (campaign.status !== "active") {
      return res
        .status(400)
        .json({ success: false, error: "Campaign is no longer active" });
    }

    if (new Date() > new Date(campaign.expiresAt)) {
      // Mark subscriber as expired
      await subscriberModel.findByIdAndUpdate(subscriber._id, {
        status: "expired",
      });
      return res
        .status(400)
        .json({ success: false, error: "Discount code has expired" });
    }

    const discountAmount = resolveDiscountAmount(
      cartTotal,
      campaign.discountType,
      campaign.discountValue,
    );

    return res.status(200).json({
      success: true,
      discountAmount,
      finalAmount: cartTotal - discountAmount,
      discountType: campaign.discountType,
      discountValue: campaign.discountValue,
      campaignId: campaign._id,
    });
  } catch (error) {
    console.error("Error validating discount code:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

export const resolveDiscountAmount = (
  cartTotal,
  discountType,
  discountValue,
) => {
  if (discountType === "percentage") {
    return Math.round((discountValue / 100) * cartTotal);
  }

  if (discountType === "fixed") {
    return Math.min(discountValue, cartTotal);
  }

  return 0;
};
