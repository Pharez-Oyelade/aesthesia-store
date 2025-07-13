import React, { useEffect, useState, useContext } from "react";
import { shopContext } from "../context/ShopContext";
import axios from "axios";

const PromotionBanner = () => {
  const { token } = useContext(shopContext);
  const [promotion, setPromotion] = useState(null);

  useEffect(() => {
    if (token) {
      axios
        .get("/api/mailchimp/latest-promotion")
        .then((res) => setPromotion(res.data.promotion))
        .catch(() => setPromotion(null));
    }
  }, [token]);

  if (!promotion) return null;

  return (
    <div className="bg-yellow-200 text-center p-4">
      <strong>{promotion.title}</strong>
      <div dangerouslySetInnerHTML={{ __html: promotion.html }} />
    </div>
  );
};

export default PromotionBanner;
