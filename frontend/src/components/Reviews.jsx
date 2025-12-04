// import React, { useEffect, useState } from "react";
// import { reviews } from "../../data/review";

// const Reviews = () => {
//   const [current, setCurrent] = useState(0);
//   const len = reviews.length;

//   const prev = () => setCurrent((c) => (c - 1 + len) % len);
//   const next = () => setCurrent((c) => (c + 1) % len);

//   useEffect(() => {
//     const onKey = (e) => {
//       if (e.key === "ArrowRight") next();
//       if (e.key === "ArrowLeft") prev();
//     };
//     window.addEventListener("keydown", onKey);
//     return () => window.removeEventListener("keydown", onKey);
//   }, [len]);

//   const prevIndex = (current - 1 + len) % len;
//   const nextIndex = (current + 1) % len;

//   return (
//     <div className="relative">
//       <div className="flex items-center justify-center space-x-4 overflow-hidden">
//         <button
//           onClick={prev}
//           aria-label="Previous review"
//           className="hidden md:inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/90 shadow hover:bg-white transition"
//         >
//           ‹
//         </button>

//         <div className="flex items-center justify-center w-full max-w-4xl h-100">
//           {[prevIndex, current, nextIndex].map((idx, pos) => {
//             const isCenter = pos === 1;
//             const sizeClasses = isCenter ? "w-72 md:w-96" : "w-56 md:w-72";
//             const transformClasses = isCenter
//               ? "scale-100 opacity-100"
//               : "scale-75 opacity-50";

//             return (
//               <div
//                 key={reviews[idx].id}
//                 className={`mx-2 ${sizeClasses} transform ${transformClasses} transition-all duration-300 border p-4 rounded-lg shadow-sm bg-white`}
//               >
//                 <h3 className="text-lg font-semibold mb-2">
//                   {reviews[idx].name}
//                 </h3>
//                 <p className="text-yellow-500 mb-2">
//                   {"★".repeat(reviews[idx].rating)}
//                   {"☆".repeat(5 - reviews[idx].rating)}
//                 </p>
//                 <p className="text-gray-700">{reviews[idx].comment}</p>
//               </div>
//             );
//           })}
//         </div>

//         <button
//           onClick={next}
//           aria-label="Next review"
//           className="hidden md:inline-flex items-center justify-center h-10 w-10 rounded-full bg-white/90 shadow hover:bg-white transition"
//         >
//           ›
//         </button>
//       </div>

//       {/* Small buttons for mobile */}
//       <div className="flex md:hidden items-center justify-center gap-4 mt-4">
//         <button
//           onClick={prev}
//           aria-label="Previous review"
//           className="px-4 py-2 bg-gray-200 rounded"
//         >
//           Prev
//         </button>
//         <button
//           onClick={next}
//           aria-label="Next review"
//           className="px-4 py-2 bg-gray-200 rounded"
//         >
//           Next
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Reviews;

import React, { useState } from "react";
import { reviews } from "../../data/review";
import Title from "./Title";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const Reviews = () => {
  const [index, setIndex] = useState(0);

  const nextReview = () => {
    setIndex((prev) => (prev + 1) % reviews.length);
  };

  const prevReview = () => {
    setIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  // Get three reviews: previous, current (center), next
  const getVisibleReviews = () => {
    const prev = (index - 1 + reviews.length) % reviews.length;
    const next = (index + 1) % reviews.length;

    return [reviews[prev], reviews[index], reviews[next]];
  };

  const visible = getVisibleReviews();

  return (
    <div className="pb-10">
      <div className="text-center my-10">
        <div className="text-2xl sm:text-3xl">
          <Title text1={"Reviews"} text2={"from our Customers"} />
        </div>
        <p className="font-semibold text-xl">"Loved by Those Who Know Style"</p>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-center gap-5 my-4">
        <button
          onClick={prevReview}
          className="px-3 py-2 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300"
        >
          ←
        </button>
        <button
          onClick={nextReview}
          className="px-3 py-2 bg-gray-200 rounded-lg shadow-md hover:bg-gray-300"
        >
          →
        </button>
      </div>

      <div className="flex justify-center items-center gap-5 sm:gap-10 py-5 text-xs sm:text-sm md:text-base overflow-hidden">
        {visible.map((review, i) => {
          const isCenter = i === 1;

          return (
            <motion.div
              key={review.id}
              animate={{
                scale: isCenter ? 1.05 : 0.85,
                opacity: isCenter ? 1 : 0.6,
              }}
              transition={{ duration: 0.4 }}
              className="flex items-center justify-center"
            >
              <div className="mx-2 w-72 transition-all duration-300 border p-4 rounded-xl shadow-xl bg-[#fffaf0]">
                <h3 className="text-lg font-semibold mb-2">{review.name}</h3>
                <p className="text-yellow-500 mb-2">
                  {"★".repeat(review.rating)}
                  {"☆".repeat(5 - review.rating)}
                </p>
                <p className="text-gray-700">{review.comment}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
      {/* Shop the collections our customers adore CTA */}
      <Link to="/collection">
        <div className="text-center w-[85%] sm:w-[30%] rounded-full px-3 py-5 mx-auto mt-6 hover:scale-[1.05] transition ease-in-out cursor-pointer text-white bg-red-800">
          <h2 className="text-base font-semibold mb-2">
            Shop the collections our customers adore
          </h2>
        </div>
      </Link>

      {/* Optional auto-scroll on mobile — uncomment if needed */}
      {/* <div className="sm:hidden text-center mt-3 text-gray-500 text-xs">
        Swipe left or right to explore
      </div> */}
    </div>
  );
};

export default Reviews;

// import React, { useState, useEffect } from "react";
// import { reviews } from "../../data/review";

// // Sample reviews data - replace with your actual import

// const Title = ({ text1, text2 }) => (
//   <h2 className="font-bold">
//     {text1} <span className="text-gray-500">{text2}</span>
//   </h2>
// );

// const Reviews = () => {
//   const [currentIndex, setCurrentIndex] = useState(0);
//   const [isAutoPlaying, setIsAutoPlaying] = useState(true);

//   // Auto-scroll functionality
//   useEffect(() => {
//     if (!isAutoPlaying) return;

//     const interval = setInterval(() => {
//       setCurrentIndex((prev) => (prev + 1) % reviews.length);
//     }, 5000);

//     return () => clearInterval(interval);
//   }, [isAutoPlaying]);

//   const handlePrevious = () => {
//     setIsAutoPlaying(false);
//     setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
//   };

//   const handleNext = () => {
//     setIsAutoPlaying(false);
//     setCurrentIndex((prev) => (prev + 1) % reviews.length);
//   };

//   const getVisibleReviews = () => {
//     const visible = [];
//     for (let i = -1; i <= 1; i++) {
//       const index = (currentIndex + i + reviews.length) % reviews.length;
//       visible.push({ review: reviews[index], position: i });
//     }
//     return visible;
//   };

//   return (
//     <div className="py-10">
//       <div className="text-center mb-8">
//         <div className="text-2xl sm:text-3xl">
//           <Title text1="Reviews" text2="From Our Customers" />
//         </div>
//       </div>

//       <div className="relative max-w-6xl mx-auto px-4">
//         {/* Reviews Container */}
//         <div className="flex items-center justify-center gap-4 overflow-hidden py-8">
//           {getVisibleReviews().map(({ review, position }) => (
//             <div
//               key={review.id}
//               className={`transition-all duration-500 ease-in-out ${
//                 position === 0
//                   ? "scale-100 opacity-100 z-10"
//                   : "scale-75 opacity-40 hidden sm:block"
//               }`}
//               style={{
//                 transform: position === 0 ? "scale(1)" : "scale(0.75)",
//               }}
//             >
//               <div className="w-72 sm:w-80 border p-6 rounded-xl shadow-xl bg-[#fffaf0]">
//                 <h3 className="text-lg font-semibold mb-2">{review.name}</h3>
//                 <p className="text-yellow-500 mb-3">
//                   {"★".repeat(review.rating)}
//                   {"☆".repeat(5 - review.rating)}
//                 </p>
//                 <p className="text-gray-700 text-sm">{review.comment}</p>
//               </div>
//             </div>
//           ))}
//         </div>

//         {/* Navigation Buttons */}
//         <div className="flex justify-center items-center gap-4 mt-4">
//           <button
//             onClick={handlePrevious}
//             className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full transition-colors duration-200 shadow-lg"
//             aria-label="Previous review"
//           >
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15 19l-7-7 7-7"
//               />
//             </svg>
//           </button>

//           {/* Dot Indicators */}
//           <div className="flex gap-2">
//             {reviews.map((_, index) => (
//               <button
//                 key={index}
//                 onClick={() => {
//                   setIsAutoPlaying(false);
//                   setCurrentIndex(index);
//                 }}
//                 className={`w-2 h-2 rounded-full transition-all duration-300 ${
//                   index === currentIndex
//                     ? "bg-gray-800 w-8"
//                     : "bg-gray-400 hover:bg-gray-600"
//                 }`}
//                 aria-label={`Go to review ${index + 1}`}
//               />
//             ))}
//           </div>

//           <button
//             onClick={handleNext}
//             className="bg-gray-800 hover:bg-gray-700 text-white p-3 rounded-full transition-colors duration-200 shadow-lg"
//             aria-label="Next review"
//           >
//             <svg
//               className="w-6 h-6"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M9 5l7 7-7 7"
//               />
//             </svg>
//           </button>
//         </div>

//         {/* Review Counter */}
//         <div className="text-center mt-4 text-sm text-gray-600">
//           {currentIndex + 1} / {reviews.length}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Reviews;
