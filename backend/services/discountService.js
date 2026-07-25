import mongoose from "mongoose";
import productModel from "../models/productModel.js";
import subscriberModel from "../models/subscriberModel.js";
import campaignModel from "../models/campaignModel.js";

const normalizeText = (value = "") => value.toString().trim().toLowerCase();

export const getDiscountWindow = (campaign) => ({
  startsAt: campaign?.discountStartsAt || campaign?.startsAt || null,
  expiresAt: campaign?.discountExpiresAt || campaign?.expiresAt || null,
});

export const getSubscriptionWindow = (campaign) => ({
  startsAt: campaign?.subscriptionStartsAt || campaign?.startsAt || null,
  endsAt: campaign?.subscriptionEndsAt || null,
});

export const resolveDiscountAmount = (
  discountBaseAmount,
  discountType,
  discountValue,
) => {
  const baseAmount = Math.max(Number(discountBaseAmount) || 0, 0);
  const value = Math.max(Number(discountValue) || 0, 0);

  if (discountType === "percentage") {
    return Math.round((value / 100) * baseAmount);
  }

  if (discountType === "fixed") {
    return Math.min(value, baseAmount);
  }

  return 0;
};

const getLineProductId = (item) =>
  item?._id || item?.productId || item?.itemId || item?.id || null;

const getLineQuantity = (item) => {
  const quantity = Number(item?.quantity);
  return Number.isFinite(quantity) && quantity > 0 ? quantity : 0;
};

const getProductPrice = (product) => {
  if (product?.onSale && Number(product?.salePrice) > 0) {
    return Number(product.salePrice);
  }

  return Number(product?.price) || 0;
};

export const isCampaignDiscountActive = (campaign, now = new Date()) => {
  if (!campaign || campaign.status !== "active") return false;

  const { startsAt, expiresAt } = getDiscountWindow(campaign);
  if (startsAt && now < new Date(startsAt)) return false;
  if (expiresAt && now > new Date(expiresAt)) return false;

  return true;
};

export const isCampaignSubscriptionOpen = (campaign, now = new Date()) => {
  if (!campaign || campaign.status !== "active") return false;

  const { startsAt, endsAt } = getSubscriptionWindow(campaign);
  if (startsAt && now < new Date(startsAt)) return false;
  if (endsAt && now > new Date(endsAt)) return false;

  const limit = Number(campaign.subscriberLimit);
  if (Number.isFinite(limit) && limit > 0) {
    return Number(campaign.subscriberCount || 0) < limit;
  }

  return true;
};

export const getRemainingSubscriptionSpots = (campaign) => {
  const limit = Number(campaign?.subscriberLimit);
  if (!Number.isFinite(limit) || limit <= 0) return null;

  return Math.max(limit - Number(campaign?.subscriberCount || 0), 0);
};

export const calculateDiscountBaseFromItems = async (items = [], campaign) => {
  const lines = Array.isArray(items) ? items : [];
  const ids = [
    ...new Set(
      lines
        .map(getLineProductId)
        .filter(Boolean)
        .map(String)
        .filter((id) => mongoose.Types.ObjectId.isValid(id)),
    ),
  ];

  if (ids.length === 0) {
    return {
      cartSubtotal: 0,
      eligibleSubtotal: 0,
      eligibleItemCount: 0,
      eligibleCollections: campaign?.eligibleCollections || [],
      discountScope: campaign?.discountScope || "all",
    };
  }

  const products = await productModel.find({ _id: { $in: ids } }).lean();
  const productsById = new Map(products.map((product) => [String(product._id), product]));
  const discountScope = campaign?.discountScope || "all";
  const eligibleCollections = Array.isArray(campaign?.eligibleCollections)
    ? campaign.eligibleCollections
    : [];
  const normalizedCollections = eligibleCollections.map(normalizeText);
  const eligibleProducts = Array.isArray(campaign?.eligibleProducts)
    ? campaign.eligibleProducts.map(String)
    : [];

  let cartSubtotal = 0;
  let eligibleSubtotal = 0;
  let eligibleItemCount = 0;

  for (const line of lines) {
    const productId = getLineProductId(line);
    const quantity = getLineQuantity(line);
    const product = productsById.get(String(productId));

    if (!product || quantity <= 0) continue;

    const lineTotal = getProductPrice(product) * quantity;
    cartSubtotal += lineTotal;

    const productCollection = normalizeText(product.section);
    const isEligible =
      discountScope === "all" ||
      (discountScope === "collection" && normalizedCollections.includes(productCollection)) ||
      (discountScope === "product" && eligibleProducts.includes(String(productId)));

    if (isEligible) {
      eligibleSubtotal += lineTotal;
      eligibleItemCount += quantity;
    }
  }

  return {
    cartSubtotal,
    eligibleSubtotal,
    eligibleItemCount,
    eligibleCollections,
    discountScope,
  };
};

export const resolveDiscountForCode = async ({ code, items = [] }) => {
  if (!code) {
    return {
      success: false,
      reason: "MISSING_CODE",
      message: "Discount code is required",
    };
  }

  let subscriber = await subscriberModel
    .findOne({ code: code.toUpperCase() })
    .populate("campaignId");

  let campaign;

  if (!subscriber) {
    campaign = await campaignModel.findOne({ code: code.toUpperCase() });
    
    if (!campaign || campaign.usageType !== "multi-use") {
      return {
        success: false,
        reason: "INVALID_CODE",
        message: "Invalid discount code",
      };
    }

    const limit = Number(campaign.subscriberLimit);
    if (Number.isFinite(limit) && limit > 0 && campaign.usageCount >= limit) {
      return {
        success: false,
        reason: "USED_CODE",
        message: "Discount code usage limit has been reached",
      };
    }
  } else {
    campaign = subscriber.campaignId;

    if (subscriber.status === "used") {
      return {
        success: false,
        reason: "USED_CODE",
        message: "Discount code has already been used",
      };
    }

    if (subscriber.status === "expired") {
      return {
        success: false,
        reason: "EXPIRED_CODE",
        message: "Discount code has expired",
      };
    }
  }

  if (!campaign || campaign.status !== "active") {
    return {
      success: false,
      reason: "INACTIVE_CAMPAIGN",
      message: "Campaign is no longer active",
    };
  }

  const now = new Date();
  const { startsAt, expiresAt } = getDiscountWindow(campaign);

  if (startsAt && now < new Date(startsAt)) {
    return {
      success: false,
      reason: "DISCOUNT_NOT_STARTED",
      message: "Discount code is not active yet",
    };
  }

  if (expiresAt && now > new Date(expiresAt)) {
    if (subscriber) {
      await subscriberModel.findByIdAndUpdate(subscriber._id, {
        status: "expired",
      });
    }

    return {
      success: false,
      reason: "EXPIRED_CODE",
      message: "Discount code has expired",
    };
  }

  const base = await calculateDiscountBaseFromItems(items, campaign);

  if (base.eligibleSubtotal <= 0) {
    const collections = base.eligibleCollections.join(", ");
    return {
      success: false,
      validCode: true,
      reason: "NOT_APPLICABLE_TO_CART",
      code: subscriber ? subscriber.code : campaign.code,
      campaignId: campaign._id,
      discountScope: base.discountScope,
      eligibleCollections: base.eligibleCollections,
      eligibleSubtotal: base.eligibleSubtotal,
      cartSubtotal: base.cartSubtotal,
      message:
        base.discountScope === "collection" && collections
          ? `This code only applies to products in ${collections}. Add an eligible item to use it.`
          : base.discountScope === "product"
          ? "This code only applies to specific products. Add an eligible item to use it."
          : "This code does not apply to the items currently in your cart.",
    };
  }

  const discountAmount = resolveDiscountAmount(
    base.eligibleSubtotal,
    campaign.discountType,
    campaign.discountValue,
  );

  return {
    success: discountAmount > 0,
    reason: discountAmount > 0 ? "APPLIED" : "NO_DISCOUNT_VALUE",
    code: subscriber ? subscriber.code : campaign.code,
    campaignId: campaign._id,
    discountAmount,
    finalAmount: Math.max(base.cartSubtotal - discountAmount, 0),
    discountType: campaign.discountType,
    discountValue: campaign.discountValue,
    discountScope: base.discountScope,
    eligibleCollections: base.eligibleCollections,
    eligibleSubtotal: base.eligibleSubtotal,
    cartSubtotal: base.cartSubtotal,
    expiresAt,
    message:
      discountAmount > 0
        ? "Discount code applied successfully"
        : "This discount is not currently configured with a usable value.",
  };
};
