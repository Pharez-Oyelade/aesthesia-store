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
        Please allow up to 7 working days for your order to be processed
      </p>

      {/* Right side - currency toggle */}
    </div>
  );
}
