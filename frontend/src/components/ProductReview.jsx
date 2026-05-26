import React, { useState, useRef, useEffect } from "react";
import Title from "./Title";
import { FaStar } from "react-icons/fa";
import { assets } from "../assets/assets.js";

const ProductReview = ({ reviews }) => {
  // handle next and prev buttons to scroll cards
  const scrollRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const REVIEW_FEATURE_ENABLED =
    import.meta.env.VITE_REVIEWS_ENABLED === "true";

  const handleNext = () => {
    if (currentIndex < reviews.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };
  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  useEffect(() => {
    if (scrollRef.current) {
      const scrollAmount = currentIndex * scrollRef.current.offsetWidth;
      scrollRef.current.scrollTo({ left: scrollAmount, behavior: "smooth" });
    }
  }, [currentIndex]);

  // if (!REVIEW_FEATURE_ENABLED) {
  //   return null;
  // }

  if (!reviews || reviews.length === 0) {
    return;
  }

  return (
    <div>
      <div className="text-center py-2 text-3xl uppercase">
        <Title text1="Customer" text2="Reviews" />
      </div>

      {/* Review cards carousel with navigation button (next/prev) */}
      <div className="max-w-6xl mx-auto px-4 mt-12 relative">
        <div
          className="flex space-x-4 overflow-x-auto py-4 scrollbar-hide"
          ref={scrollRef}
        >
          {/* Review card */}
          {reviews.map((review) => (
            <div
              className="flex-shrink-0 flex flex-col justify-between bg-white p-4 rounded-lg shadow-md w-full sm:w-1/2 md:w-1/3"
              key={review.id}
            >
              {/* <p className="font-bold text-sm">{review.name}</p> */}
              <div className="text-gray-600">
                <div className="flex items-center">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500" />
                  ))}
                </div>
                <p className="mt-2">{review.comment}</p>
              </div>
              {/* <p className="mt-2">{review.comment}</p> */}
              <div className="mt-4 flex items-center">
                {review.image && (
                  <div className="w-14 h-14 rounded-full overflow-hidden mr-4">
                    <img
                      src={review.image}
                      alt={review.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div>
                  <p className="font-bold text-sm">{review.name}</p>
                  <div className="flex items-center">
                    <p className="text-green-500 text-xs">Verified Buyer</p>

                    <img
                      src={assets.verify}
                      alt="Verified"
                      className="w-3 h-3 ml-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation buttons */}
        {/* <div className="absolute top-1/2 transform -translate-y-1/2 left-0">
          <button
            className="bg-gray-300 p-3 rounded-full shadow-md hover:bg-gray-400 transition-colors duration-300"
            onClick={handlePrev}
          >
            &#8592;
          </button>
        </div>
        <div className="absolute top-1/2 transform -translate-y-1/2 right-0">
          <button
            className="bg-gray-300 p-3 rounded-full shadow-md hover:bg-gray-400 transition-colors duration-300"
            onClick={handleNext}
          >
            &#8594;
          </button>
        </div> */}
      </div>
    </div>
  );
};

export default ProductReview;
