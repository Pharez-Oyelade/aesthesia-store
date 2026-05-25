import React from "react";
import Title from "./Title";
import { FaStar } from "react-icons/fa";

const ProductReview = ({ reviews }) => {
  return (
    <div>
      <div className="text-center py-2 text-3xl uppercase">
        <Title text1="Customer" text2="Reviews" />
      </div>

      {/* Review cards carousel with navigation button (next/prev) */}
      <div className="max-w-6xl mx-auto px-4 mt-12 relative">
        <div className="flex space-x-4 overflow-x-auto py-4">
          {/* Review card */}
          {reviews.map((review) => (
            <div
              className="flex-shrink-0 bg-white p-4 rounded-lg shadow-md w-1/3"
              key={review.id}
            >
              {/* <p className="font-bold text-sm">{review.name}</p> */}
              <p className="text-gray-600">
                <div className="flex items-center">
                  {[...Array(review.rating)].map((_, i) => (
                    <FaStar key={i} className="text-yellow-500" />
                  ))}
                </div>
              </p>
              <p className="mt-2">{review.comment}</p>
              <p className="font-bold text-sm mt-10">{review.name}</p>
            </div>
          ))}
          {/* Add more review cards as needed */}
        </div>
      </div>
    </div>
  );
};

export default ProductReview;
