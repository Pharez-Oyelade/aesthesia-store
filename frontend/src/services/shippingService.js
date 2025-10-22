// International shipping rates (per kg)
const INTERNATIONAL_RATES = {
  US: { base: 15000, perKg: 8000 },
  UK: { base: 12000, perKg: 7000 },
  CA: { base: 14000, perKg: 7500 },
  AU: { base: 16000, perKg: 9000 },
  DE: { base: 11000, perKg: 6500 },
  FR: { base: 11000, perKg: 6500 },
  IT: { base: 11000, perKg: 6500 },
  ES: { base: 11000, perKg: 6500 },
  NL: { base: 11000, perKg: 6500 },
  BE: { base: 11000, perKg: 6500 },
  DEFAULT: { base: 13000, perKg: 8000 },
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
};

export function calculateCartWeight(cartItems, products) {
  let totalWeight = 0;

  for (const itemId in cartItems) {
    const product = products.find((p) => p._id === itemId);
    if (!product || !product.weight) continue;

    for (const size in cartItems[itemId]) {
      for (const colorKey in cartItems[itemId][size]) {
        for (const mKey in cartItems[itemId][size][colorKey]) {
          const quantity = cartItems[itemId][size][colorKey][mKey];
          if (quantity > 0) {
            totalWeight += product.weight * quantity;
          }
        }
      }
    }
  }

  return totalWeight;
}

export function calculateInternationalShipping(country, weightInGrams) {
  const countryCode = COUNTRY_CODES[country] || "DEFAULT";
  const rates =
    INTERNATIONAL_RATES[countryCode] || INTERNATIONAL_RATES["DEFAULT"];

  const weightInKg = weightInGrams / 1000;
  const shippingCost = rates.base + rates.perKg * weightInKg;

  return Math.ceil(shippingCost);
}

export function isInternationalOrder(country) {
  return (
    country &&
    country !== "Nigeria" &&
    !["Lagos Mainland", "Lagos Island", "Abuja", "Other"].includes(country)
  );
}
