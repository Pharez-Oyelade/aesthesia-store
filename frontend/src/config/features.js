const parseBooleanFlag = (value) => {
  if (value == null) return null;

  const normalized = String(value).trim().toLowerCase();
  if (["1", "true", "yes", "on"].includes(normalized)) return true;
  if (["0", "false", "no", "off"].includes(normalized)) return false;

  return null;
};

export const isDiscountWaitlistEnabled = (() => {
  const explicitFlag = parseBooleanFlag(
    import.meta.env.VITE_DISCOUNT_WAITLIST_ENABLED,
  );

  if (explicitFlag !== null) {
    return explicitFlag;
  }

  return import.meta.env.DEV;
})();
