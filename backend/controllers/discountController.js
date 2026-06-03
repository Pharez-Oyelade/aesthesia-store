import {
  resolveDiscountAmount,
  resolveDiscountForCode,
} from "../services/discountService.js";
import { isDiscountWaitlistEnabled } from "../config/features.js";

// POST validate discount code - called at checkout
export const validateDiscountCode = async (req, res) => {
  const { code, items } = req.body;

  if (!code) {
    return res.status(400).json({
      success: false,
      message: "Discount code is required",
    });
  }

  if (!isDiscountWaitlistEnabled) {
    return res.status(404).json({
      success: false,
      message: "Discount codes are not available right now.",
    });
  }

  try {
    const discount = await resolveDiscountForCode({ code, items });
    return res.status(200).json(discount);
  } catch (error) {
    console.error("Error validating discount code:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};
export { resolveDiscountAmount };
