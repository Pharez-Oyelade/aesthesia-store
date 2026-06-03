import campaignModel from "../models/campaignModel.js";
import subscriberModel from "../models/subscriberModel.js";
import { generateUniqueCode } from "../services/codeService.js";
import { sendWaitlistEmail } from "../services/emailService.js";
import { isDiscountWaitlistEnabled } from "../config/features.js";
import {
  getDiscountWindow,
  getRemainingSubscriptionSpots,
  getSubscriptionWindow,
  isCampaignSubscriptionOpen,
} from "../services/discountService.js";

// GET active waitlist campaign
export const getActiveWaitlist = async (req, res) => {
  if (!isDiscountWaitlistEnabled) {
    return res.status(200).json({ isOpen: false });
  }

  try {
    const campaign = await campaignModel.findOne({
      type: "waitlist",
      status: "active",
    });

    if (!campaign) {
      return res.status(200).json({ isOpen: false });
    }

    const isOpen = isCampaignSubscriptionOpen(campaign);
    const remainingSpots = getRemainingSubscriptionSpots(campaign);
    const subscriptionWindow = getSubscriptionWindow(campaign);
    const discountWindow = getDiscountWindow(campaign);

    return res.status(200).json({
      isOpen,
      remainingSpots,
      campaign: {
        _id: campaign._id,
        title: campaign.name,
        description: `Join our waitlist and get ${campaign.discountValue}${campaign.discountType === "percentage" ? "%" : ""} off`,
        // code: campaign.codePrefix,
        discountValue: campaign.discountValue,
        discountType: campaign.discountType,
        discountScope: campaign.discountScope || "all",
        eligibleCollections: campaign.eligibleCollections || [],
        subscriptionStartsAt: subscriptionWindow.startsAt,
        subscriptionEndsAt: subscriptionWindow.endsAt,
        discountStartsAt: discountWindow.startsAt,
        discountExpiresAt: discountWindow.expiresAt,
        expiresAt: discountWindow.expiresAt,
      },
      campaignId: campaign._id,
      discountValue: campaign.discountValue,
      discountType: campaign.discountType,
      discountScope: campaign.discountScope || "all",
      eligibleCollections: campaign.eligibleCollections || [],
      subscriptionStartsAt: subscriptionWindow.startsAt,
      subscriptionEndsAt: subscriptionWindow.endsAt,
      discountStartsAt: discountWindow.startsAt,
      discountExpiresAt: discountWindow.expiresAt,
      expiresAt: discountWindow.expiresAt,
    });
  } catch (error) {
    console.error("Error fetching active waitlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST subscibe to waitlist
export const subscribeToWaitlist = async (req, res) => {
  const { id } = req.params;
  const { email } = req.body;

  if (!isDiscountWaitlistEnabled) {
    return res.status(404).json({ error: "Waitlist is not available" });
  }

  try {
    // check if email already subscribed
    const existingSubscriber = await subscriberModel.findOne({
      campaignId: id,
      email: email.toLowerCase(),
    });

    if (existingSubscriber) {
      return res.status(409).json({
        error: "Email already subscribed",
        code: existingSubscriber.code,
      });
    }

    const campaignConfig = await campaignModel.findById(id);

    if (!isCampaignSubscriptionOpen(campaignConfig)) {
      return res.status(410).json({ error: "Waitlist is closed" });
    }

    const limit = Number(campaignConfig.subscriberLimit);
    const capacityFilter =
      Number.isFinite(limit) && limit > 0
        ? { $expr: { $lt: ["$subscriberCount", "$subscriberLimit"] } }
        : {};

    // claim spot atomically
    const campaign = await campaignModel.findOneAndUpdate(
      {
        _id: id,
        status: "active",
        ...capacityFilter,
      },
      { $inc: { subscriberCount: 1 } },
      { new: true },
    );

    if (!campaign) {
      return res.status(410).json({ error: "Waitlist is full or closed" });
    }

    const discountWindow = getDiscountWindow(campaign);

    const code = await generateUniqueCode(campaign.codePrefix);

    const subscriber = await subscriberModel.create({
      campaignId: id,
      email: email.toLowerCase(),
      code,
      status: "active",
    });

    // Non blocking email service
    sendWaitlistEmail({
      to: subscriber.email,
      code: subscriber.code,
      discountValue: campaign.discountValue,
      expiresAt: discountWindow.expiresAt,
    }).catch((err) => console.error("Error sending waitlist email:", err));

    return res.status(201).json({
      message: "Successfully joined the waitlist",
      code: subscriber.code,
      discountType: campaign.discountType,
      discountValue: campaign.discountValue,
      discountScope: campaign.discountScope || "all",
      eligibleCollections: campaign.eligibleCollections || [],
      discountStartsAt: discountWindow.startsAt,
      discountExpiresAt: discountWindow.expiresAt,
      expiresAt: discountWindow.expiresAt,
    });
  } catch (error) {
    console.error("Error subscribing to waitlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
