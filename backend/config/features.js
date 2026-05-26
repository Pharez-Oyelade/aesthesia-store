const parseBooleanFlag = (value) => {
  if (value == null) return null;

  const normalized = String(value).trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;

  return null;
};

export const isDiscountWaitlistEnabled = (() => {
  const explicitFlag = parseBooleanFlag(process.env.DISCOUNT_WAITLIST_ENABLED);

  if (explicitFlag !== null) {
    return explicitFlag;
  }

  const isProductionRuntime =
    process.env.NODE_ENV === "production" ||
    process.env.VERCEL_ENV === "production" ||
    process.env.RENDER === "true" ||
    Boolean(process.env.RENDER_EXTERNAL_URL || process.env.RENDER_SERVICE_ID);

  return !isProductionRuntime;
})();
