import React, { useState, useContext, useEffect } from "react";
import { shopContext } from "../context/ShopContext";

const NewsletterBox = () => {
  const { userData, subscribeToMailchimp, token } = useContext(shopContext);
  const [email, setEmail] = useState(userData.email || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update email when userData changes
  useEffect(() => {
    if (userData.email) {
      setEmail(userData.email);
    }
  }, [userData.email]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email) {
      return;
    }

    setIsSubmitting(true);

    // Use user's name if logged in, otherwise empty string
    const name = token ? userData.name : "";

    console.log("Subscribing to newsletter:", { email, name, token: !!token });

    const success = await subscribeToMailchimp(email, name);

    if (success) {
      setEmail(""); // Clear the form on success
    } else {
      // If failed and user is logged in, suggest using a different email
      if (token && userData.email && email === userData.email) {
        // Don't clear the email field so user can modify it
      }
    }

    setIsSubmitting(false);
  };

  return (
    <div className="text-center">
      <h1 className="font-bold text-3xl mb-3">Join Our List</h1>
      <p className="text-2xl font-medium text-gray-800">
        Signup to be the first to hear about exclusive deals
      </p>
      <form
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3"
        onSubmit={handleSubmit}
      >
        <input
          className="w-full sm:flex-1 outline-none"
          type="email"
          placeholder={token && userData.email ? userData.email : "Enter Email"}
          // value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={isSubmitting}
        />
        <button
          type="submit"
          className="bg-[#691110] text-white text-xs px-10 py-4 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isSubmitting}
        >
          {isSubmitting ? "SUBSCRIBING..." : "SUBSCRIBE"}
        </button>
      </form>
      {token && (
        <p className="text-xs text-gray-500 mt-2">
          💡 Tip: If you previously unsubscribed, try using a different email
          address
        </p>
      )}
    </div>
  );
};

export default NewsletterBox;
