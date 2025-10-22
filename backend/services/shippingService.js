import axios from "axios";

// International shipping rates (per kg)
const INTERNATIONAL_RATES = {
  US: { base: 15000, perKg: 8000 }, // $15 base + $8 per kg
  UK: { base: 12000, perKg: 7000 }, // $12 base + $7 per kg
  CA: { base: 14000, perKg: 7500 }, // $14 base + $7.5 per kg
  AU: { base: 16000, perKg: 9000 }, // $16 base + $9 per kg
  DE: { base: 11000, perKg: 6500 }, // $11 base + $6.5 per kg
  FR: { base: 11000, perKg: 6500 }, // $11 base + $6.5 per kg
  IT: { base: 11000, perKg: 6500 }, // $11 base + $6.5 per kg
  ES: { base: 11000, perKg: 6500 }, // $11 base + $6.5 per kg
  NL: { base: 11000, perKg: 6500 }, // $11 base + $6.5 per kg
  BE: { base: 11000, perKg: 6500 }, // $11 base + $6.5 per kg
  DEFAULT: { base: 13000, perKg: 8000 }, // Default rate
};

// Country code mapping
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
  let totalWeight = 0; // in grams

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

  return totalWeight; // Returns weight in grams
}

export function calculateInternationalShipping(country, weightInGrams) {
  const countryCode = COUNTRY_CODES[country] || "DEFAULT";
  const rates =
    INTERNATIONAL_RATES[countryCode] || INTERNATIONAL_RATES["DEFAULT"];

  const weightInKg = weightInGrams / 1000;
  const shippingCost = rates.base + rates.perKg * weightInKg;

  return Math.ceil(shippingCost); // Round up to nearest naira
}

export async function getShippingRatesFromAPI(country, weightInGrams) {
  try {
    // Example using a shipping API (you can replace with your preferred service)
    // This is a placeholder - replace with actual API integration

    const response = await axios.post(
      "https://api.shipping-service.com/rates",
      {
        origin: "NG", // Nigeria
        destination: country,
        weight: weightInGrams,
        currency: "NGN",
      }
    );

    return response.data.rates;
  } catch (error) {
    console.log("Shipping API error:", error);
    // Fallback to flat rates
    return calculateInternationalShipping(country, weightInGrams);
  }
}

export function isInternationalOrder(country) {
  return (
    country &&
    country !== "Nigeria" &&
    !["Lagos Mainland", "Lagos Island", "Abuja", "Other"].includes(country)
  );
}
