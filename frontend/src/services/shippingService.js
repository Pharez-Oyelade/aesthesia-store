// International shipping rates by weight tiers (in NGN)
const INTERNATIONAL_RATES = {
  UK: [
    { min: 0, max: 0.9, price: 65000 },
    { min: 1, max: 1.4, price: 68000 },
    { min: 1.5, max: 1.9, price: 70000 },
    { min: 2.0, max: 2.4, price: 73000 },
    { min: 2.5, max: 2.9, price: 88000 },
    { min: 3.0, max: 3.4, price: 108000 },
    { min: 3.5, max: 3.9, price: 125000 },
    { min: 4.0, max: 4.4, price: 145000 },
    { min: 4.5, max: 4.9, price: 160000 },
    { min: 5.0, max: Infinity, price: 180000 },
  ],
  US: [
    { min: 0, max: 0.9, price: 79000 },
    { min: 1, max: 1.4, price: 81000 },
    { min: 1.5, max: 1.9, price: 83000 },
    { min: 2.0, max: 2.4, price: 85000 },
    { min: 2.5, max: 2.9, price: 110000 },
    { min: 3.0, max: 3.4, price: 135000 },
    { min: 3.5, max: 3.9, price: 160000 },
    { min: 4.0, max: 4.4, price: 185000 },
    { min: 4.5, max: 4.9, price: 213000 },
    { min: 5.0, max: Infinity, price: 238000 },
  ],
  CA: [
    { min: 0, max: 0.9, price: 79000 },
    { min: 1, max: 1.4, price: 81000 },
    { min: 1.5, max: 1.9, price: 83000 },
    { min: 2.0, max: 2.4, price: 85000 },
    { min: 2.5, max: 2.9, price: 110000 },
    { min: 3.0, max: 3.4, price: 135000 },
    { min: 3.5, max: 3.9, price: 160000 },
    { min: 4.0, max: 4.4, price: 185000 },
    { min: 4.5, max: 4.9, price: 213000 },
    { min: 5.0, max: Infinity, price: 238000 },
  ],
  UAE: [
    { min: 0, max: 0.9, price: 100000 },
    { min: 1, max: 1.4, price: 104000 },
    { min: 1.5, max: 1.9, price: 106500 },
    { min: 2.0, max: 2.4, price: 108000 },
    { min: 2.5, max: 2.9, price: 134000 },
    { min: 3.0, max: 3.4, price: 163000 },
    { min: 3.5, max: 3.9, price: 192000 },
    { min: 4.0, max: 4.4, price: 221000 },
    { min: 4.5, max: 4.9, price: 252000 },
    { min: 5.0, max: Infinity, price: 279500 },
  ],
  QA: [
    { min: 0, max: 0.9, price: 100000 },
    { min: 1, max: 1.4, price: 104000 },
    { min: 1.5, max: 1.9, price: 106500 },
    { min: 2.0, max: 2.4, price: 108000 },
    { min: 2.5, max: 2.9, price: 134000 },
    { min: 3.0, max: 3.4, price: 163000 },
    { min: 3.5, max: 3.9, price: 192000 },
    { min: 4.0, max: 4.4, price: 221000 },
    { min: 4.5, max: 4.9, price: 252000 },
    { min: 5.0, max: Infinity, price: 279500 },
  ],
  // France & Italy share the same rates
  FR: [
    { min: 0, max: 0.9, price: 90000 },
    { min: 1, max: 1.4, price: 93000 },
    { min: 1.5, max: 1.9, price: 95000 },
    { min: 2.0, max: 2.4, price: 96000 },
    { min: 2.5, max: 2.9, price: 122000 },
    { min: 3.0, max: 3.4, price: 148000 },
    { min: 3.5, max: 3.9, price: 173000 },
    { min: 4.0, max: 4.4, price: 198000 },
    { min: 4.5, max: 4.9, price: 223000 },
    { min: 5.0, max: Infinity, price: 250000 },
  ],
  IT: [
    { min: 0, max: 0.9, price: 90000 },
    { min: 1, max: 1.4, price: 93000 },
    { min: 1.5, max: 1.9, price: 95000 },
    { min: 2.0, max: 2.4, price: 96000 },
    { min: 2.5, max: 2.9, price: 122000 },
    { min: 3.0, max: 3.4, price: 148000 },
    { min: 3.5, max: 3.9, price: 173000 },
    { min: 4.0, max: 4.4, price: 198000 },
    { min: 4.5, max: 4.9, price: 223000 },
    { min: 5.0, max: Infinity, price: 250000 },
  ],
  // Ghana rates
  GH: [
    { min: 0, max: 0.9, price: 70000 },
    { min: 1, max: 1.4, price: 72000 },
    { min: 1.5, max: 1.9, price: 73500 },
    { min: 2.0, max: 2.4, price: 75000 },
    { min: 2.5, max: 2.9, price: 95000 },
    { min: 3.0, max: 3.4, price: 115000 },
    { min: 3.5, max: 3.9, price: 131000 },
    { min: 4.0, max: 4.4, price: 149500 },
    { min: 4.5, max: 4.9, price: 168000 },
    { min: 5.0, max: Infinity, price: 185000 },
  ],
  // South Africa rates
  ZA: [
    { min: 0, max: 0.9, price: 77000 },
    { min: 1, max: 1.4, price: 79500 },
    { min: 1.5, max: 1.9, price: 81500 },
    { min: 2.0, max: 2.4, price: 83000 },
    { min: 2.5, max: 2.9, price: 109000 },
    { min: 3.0, max: 3.4, price: 132500 },
    { min: 3.5, max: 3.9, price: 156500 },
    { min: 4.0, max: 4.4, price: 180000 },
    { min: 4.5, max: 4.9, price: 204000 },
    { min: 5.0, max: Infinity, price: 227000 },
  ],
};

const COUNTRY_CODES = {
  "United States": "US",
  "United Kingdom": "UK",
  Canada: "CA",
  Australia: "AU",
  Germany: "DE",
  France: "FR",
  Italy: "IT",
  Spain: "ES",
  Netherlands: "NL",
  Belgium: "BE",
  "United Arab Emirates": "UAE",
  UAE: "UAE",
  Qatar: "QA",
  Ghana: "GH",
  "South Africa": "ZA",
};

export function calculateCartWeight(cartItems, products) {
  let totalWeight = 0;

  for (const itemId in cartItems) {
    const product = products.find((p) => p._id === itemId);
    // Skip if product not found or weight is missing (null/undefined).
    // Do NOT use a falsy check for weight because a weight of 0 is a valid numeric value.
    if (!product || product.weight == null) continue;

    for (const size in cartItems[itemId]) {
      for (const colorKey in cartItems[itemId][size]) {
        for (const mKey in cartItems[itemId][size][colorKey]) {
          const quantity = cartItems[itemId][size][colorKey][mKey];
          if (quantity > 0) {
            // Normalize weight units:
            // - If weight looks small (e.g. < 10) we assume it's in kilograms and convert to grams.
            // - If it's larger (>= 10) we assume it's already in grams.
            let w = Number(product.weight) || 0;
            if (w > 0 && w < 10) {
              // treat as kg -> convert to grams
              w = w * 1000;
            }
            totalWeight += w * quantity;
          }
        }
      }
    }
  }

  return totalWeight;
}

export function calculateInternationalShipping(country, weightInGrams) {
  const countryCode = COUNTRY_CODES[country] || "DEFAULT";
  const weightTiers = INTERNATIONAL_RATES[countryCode];

  // Convert grams to kg and round up to one decimal place
  // so values like 0.95kg become 1.0kg and map to the next tier.
  const weightInKg = weightInGrams / 1000;
  const weightRounded = Math.ceil(weightInKg * 10) / 10;

  // If no tiered rates for this country, use a default calculation
  if (!weightTiers) {
    // Use rounded weight for fallback too
    return Math.ceil(13000 + 8000 * weightRounded);
  }

  // Find the appropriate tier for the rounded weight
  for (const tier of weightTiers) {
    if (weightRounded >= tier.min && weightRounded <= tier.max) {
      return tier.price;
    }
  }

  // If weight exceeds all tiers, use the highest tier price
  return weightTiers[weightTiers.length - 1].price;
}

export function isInternationalOrder(country) {
  return (
    country &&
    country !== "Nigeria" &&
    !["Lagos Mainland", "Lagos Island", "Abuja", "Other"].includes(country)
  );
}
