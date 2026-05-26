import subscriberModel from "../models/subscriberModel.js";
import "../models/campaignModel.js";
import { isDiscountWaitlistEnabled } from "../config/features.js";

// POST validate discount code - called at checkout
export const validateDiscountCode = async (req, res) => {
  const { code, cartTotal } = req.body;

  if (!isDiscountWaitlistEnabled) {
    return res.status(200).json({
      success: false,
      message: "Discount codes are not available right now",
    });
  }

  if (!code || !cartTotal) {
    return res.status(400).json({
      success: false,
      message: "Code and cart total are required",
    });
  }

  try {
    const subscriber = await subscriberModel
      .findOne({ code: code.toUpperCase() })
      .populate("campaignId");

    if (!subscriber) {
      return res.status(200).json({
        success: false,
        message: "Invalid discount code",
      });
    }

    if (subscriber.status === "used") {
      return res.status(200).json({
        success: false,
        message: "Discount code has already been used",
      });
    }

    if (subscriber.status === "expired") {
      return res.status(200).json({
        success: false,
        message: "Discount code has expired",
      });
    }

    const campaign = subscriber.campaignId;

    if (campaign.status !== "active") {
      return res.status(200).json({
        success: false,
        message: "Campaign is no longer active",
      });
    }

    if (new Date() > new Date(campaign.expiresAt)) {
      // Mark subscriber as expired
      await subscriberModel.findByIdAndUpdate(subscriber._id, {
        status: "expired",
      });
      return res.status(200).json({
        success: false,
        message: "Discount code has expired",
      });
    }

    const discountAmount = resolveDiscountAmount(
      cartTotal,
      campaign.discountType,
      campaign.discountValue,
    );

    return res.status(200).json({
      success: true,
      code: subscriber.code,
      discountAmount,
      finalAmount: cartTotal - discountAmount,
      discountType: campaign.discountType,
      discountValue: campaign.discountValue,
      campaignId: campaign._id,
    });
  } catch (error) {
    console.error("Error validating discount code:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
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
