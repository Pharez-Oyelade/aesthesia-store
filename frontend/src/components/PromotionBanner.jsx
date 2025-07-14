import React, { useEffect, useState, useContext } from "react";
import { shopContext } from "../context/ShopContext";
import axios from "axios";

const PromotionBanner = () => {
  const { token, userData, backendUrl } = useContext(shopContext);
  const [promotion, setPromotion] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPromotion = async () => {
      // Only show promotions for logged-in users with email
      if (!token || !userData.email) {
        setPromotion(null);
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(
          `${backendUrl}/api/mailchimp/latest-promotion`,
          {
            headers: { token },
            params: { email: userData.email },
          }
        );

        if (response.data.promotion) {
          setPromotion(response.data.promotion);
        } else {
          setPromotion(null);
        }
      } catch (err) {
        console.error("Error fetching promotion:", err);
        setError(err.response?.data?.error || "Failed to load promotion");
        setPromotion(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPromotion();
  }, [token, userData.email, backendUrl]);

  // Don't show anything while loading or if there's an error
  if (loading || error || !promotion) return null;

  return (
    <div className="bg-yellow-200 text-center p-4 border-b border-yellow-300">
      <strong className="text-lg">{promotion.title}</strong>
      <div
        className="mt-2"
        dangerouslySetInnerHTML={{ __html: promotion.html }}
      />
    </div>
  );
};

export default PromotionBanner;
