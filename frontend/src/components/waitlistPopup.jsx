import React, { useContext } from "react";
import { shopContext } from "../context/ShopContext";
import { useEffect } from "react";
import { useState } from "react";
import { assets } from "../assets/assets";

const WaitlistPopup = () => {
  const { campaign, showPopup, setShowPopup, subscribeToWaitlist } =
    useContext(shopContext);

  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [generatedCode, setGeneratedCode] = useState("");
  const [error, setError] = useState("");

  const [copySuccess, setCopySuccess] = useState(false);

  // close popup and store dismissed in local storage
  const closePopup = () => {
    localStorage.setItem("aest_waitlist_dismissed", "true");
    setShowPopup(false);
    // Reset form state
    setEmail("");
    setSubscribed(false);
    setGeneratedCode("");
    setError("");
  };

  // show popup after 5 seconds if campaign exists
  useEffect(() => {
    const dismissed = localStorage.getItem("aest_waitlist_dismissed");
    const cachedCode = localStorage.getItem("aest_waitlist_code");

    if (campaign && !dismissed && !cachedCode) {
      const timer = setTimeout(() => {
        setShowPopup(true);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [campaign, setShowPopup]);

  // Handle Escape key to close popup
  useEffect(() => {
    if (!showPopup) return;

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        closePopup();
      }
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [showPopup]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email) {
      setError("Please enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      const response = await subscribeToWaitlist(campaign._id, email);
      setGeneratedCode(response.code);
      setSubscribed(true);
    } catch (error) {
      if (error.response?.status === 409) {
        setError(
          "This email is already subscribed to the waitlist. Your code is: " +
            error.response.data.code,
        );
      } else {
        setError("An error occurred. Please try again later.");
      }
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedCode);
    setCopySuccess(true);
    // alert("Code copied to clipboard!");
  };

  // Only render if showPopup is true
  if (!showPopup) return null;

  return (
    <div className="fixed top-0 left-0 right-0 bottom-0 h-screen w-full bg-black/50 flex justify-center items-center z-50">
      <div className="flex max-w-2xl bg-white shadow-2xl rounded-lg w-full mx-4 overflow-hidden relative">
        <div className="w-3/5 sm:w-3/4">
          <img
            src={assets.waitlist_bg}
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="bg-white p-5 sm:p-8 w-full">
          {/* Close Button */}
          <button
            onClick={closePopup}
            className="absolute top-4 right-5 text-gray-500 hover:text-gray-700 text-3xl font-light cursor-pointer"
            aria-label="Close"
          >
            ×
          </button>

          {/* Success State */}
          {subscribed && generatedCode ? (
            <div className="text-center">
              <div className="text-5xl mb-4">🎉</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                You're In!
              </h2>
              <p className="text-gray-600 mb-6">
                Check your email for a special welcome message.
              </p>

              {/* Code Display */}
              <div className="bg-gray-100 p-4 rounded mb-6">
                <p className="text-sm text-gray-600 mb-2">
                  Your Discount Code:
                </p>
                <div className="flex items-center justify-between bg-white border-2 border-gray-300 rounded p-3">
                  <span className="text-lg font-mono font-bold text-gray-800">
                    {generatedCode}
                  </span>
                  <button
                    onClick={copyToClipboard}
                    className="ml-2 bg-red-800 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition cursor-pointer"
                  >
                    {copySuccess ? "Copied!" : "Copy"}
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {campaign?.discountValue}% off coming soon!
                </p>
              </div>

              {/* Action Buttons */}
              <button
                onClick={closePopup}
                className="w-full bg-red-800 text-white py-2 rounded hover:bg-red-700 transition font-semibold cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            // Form State
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                {campaign?.title || "Special Offer"}
              </h2>
              <p className="text-gray-600 mb-6">
                {campaign?.description ||
                  "Join our waitlist for exclusive updates."}
              </p>

              {/* Error Message */}
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4 text-sm">
                  {error}
                </div>
              )}

              {/* Subscribe Form */}
              <form onSubmit={handleSubmit}>
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full border border-gray-300 rounded px-4 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-red-800 text-white py-2 rounded hover:bg-red-700 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed font-semibold"
                >
                  {loading ? "Joining..." : "Join Waitlist"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WaitlistPopup;
