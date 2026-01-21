import { useState } from "react";

export default function PreNav() {
  const [currency, setCurrency] = useState("USD");

  const toggleCurrency = () => {
    setCurrency((prev) => (prev === "USD" ? "NGN" : "USD"));
  };

  const message =
    "Please allow us up to 7-10 working days to process your order";

  return (
    <div className="fixed top-0 left-0 z-50 w-full bg-gray-900 text-gray-100 text-sm py-2 px-4">
      <div className="max-w-screen-xl mx-auto flex items-center">
        {/* Scrolling message (marquee) - we duplicate message for smooth looping */}
        <div className="flex-1">
          <div className="prenav-marquee">
            <div className="prenav-marquee-track" aria-hidden="false">
              <span className="inline-block mr-8 sm:block text-center">
                {message}
              </span>
              <span className="inline-block sm:hidden mr-8">{message}</span>
            </div>
          </div>
        </div>

        {/* Small currency toggle on the right (optional) */}
        {/* <div className="ml-4 flex-shrink-0">
          <button
            onClick={toggleCurrency}
            className="bg-transparent border border-gray-600 px-2 py-1 rounded text-sm"
            aria-label="Toggle currency"
          >
            {currency}
          </button>
        </div> */}
      </div>
    </div>
  );
}
