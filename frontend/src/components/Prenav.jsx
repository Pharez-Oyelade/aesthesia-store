import { useState } from "react";

export default function PreNav() {
  const [currency, setCurrency] = useState("USD");

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === "USD" ? "NGN" : "USD"));
  };

  return (
    <div className="fixed top-0 left-0 z-50 w-full bg-gray-900 text-gray-100 text-sm py-2 px-4 flex items-center justify-center">
      {/* Left side - info or update text */}
      <p className="truncate">
        Free shipping on orders above $50! New arrivals dropping this week.
      </p>

      {/* Right side - currency toggle */}
    </div>
  );
}
