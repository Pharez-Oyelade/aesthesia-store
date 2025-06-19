import React from "react";
import { assets } from "../assets/assets";

const Policy = () => {
  return (
    <div className="flex text-center items-center justify-center py-10 text-xs sm:text-sm md:text-base text-gray-700">
      <div>
        <img src={assets.time} className="w-12 m-auto mb-5" alt="" />
        <p className="font-semibold">Production Time</p>
        <p className="text-gray-400">
          7-10 working days after order confirmation
        </p>
      </div>
    </div>
  );
};

export default Policy;
