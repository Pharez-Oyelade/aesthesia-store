import campaignModel from "../models/campaignModel.js";
import subscriberModel from "../models/subscriberModel.js";
import { generateUniqueCode } from "../services/codeService.js";
import { sendWaitlistEmail } from "../services/emailService.js";

// GET active waitlist campaign
export const getActiveWaitlist = async (req, res) => {
  try {
    const campaign = await campaignModel.findOne({
      type: "waitlist",
      status: "active",
    });

    if (!campaign) {
      return res.status(200).json({ isOpen: false });
    }

    const isOpen = campaign.subscriberCount < campaign.subscriberLimit;
    const remainingSpots = campaign.subscriberLimit - campaign.subscriberCount;

    return res.status(200).json({
      isOpen,
      remainingSpots,
      campaignId: campaign._id,
      discountValue: campaign.discountValue,
      discountType: campaign.discountType,
      expiresAt: campaign.expiresAt,
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

    // claim spot atomically
    const campaign = await campaignModel.findOneAndUpdate(
      {
        _id: id,
        status: "active",
        $expr: { $lt: ["$subscriberCount", "$subscriberLimit"] },
      },
      { $inc: { subscriberCount: 1 } },
      { new: true },
    );

    if (!campaign) {
      return res.status(410).json({ error: "Waitlist is full" });
    }

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
      expiresAt: campaign.expiresAt,
    }).catch((err) => console.error("Error sending waitlist email:", err));

    return res.status(201).json({
      message: "Successfully joined the waitlist",
      code: subscriber.code,
      discountType: campaign.discountType,
      discountValue: campaign.discountValue,
      expiresAt: campaign.expiresAt,
    });
  } catch (error) {
    console.error("Error subscribing to waitlist:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
