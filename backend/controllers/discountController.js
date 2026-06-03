import {
  resolveDiscountAmount,
  resolveDiscountForCode,
} from "../services/discountService.js";

// POST validate discount code - called at checkout
export const validateDiscountCode = async (req, res) => {
  const { code, items } = req.body;

  if (!code) {
    return res.status(400).json({
      success: false,
      message: "Discount code is required",
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
