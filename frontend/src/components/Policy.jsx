import React from "react";
import { assets } from "../assets/assets";
import { CiDeliveryTruck } from "react-icons/ci";
import { GoPackageDependencies } from "react-icons/go";
import { Link } from "react-router-dom";

const Policy = () => {
  return (
    <div className="flex text-center items-start justify-center gap-5 sm:gap-20 py-10 text-xs sm:text-sm md:text-base text-gray-700">
      <div>
        <img src={assets.time} className="w-12 m-auto mb-5" alt="" />
        <p className="font-semibold">Production Time</p>
        <p className="text-gray-400">
          7-10 working days after order confirmation
        </p>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="w-12 text-6xl text-black m-auto mb-2">
          <CiDeliveryTruck />
        </div>

        <p className="font-semibold">Shipping Policy</p>
        <p className="text-gray-400">
          Check our{" "}
          <Link to="/shipping-policy" className="text-red-800 hover:underline">
            Shipping Policy
          </Link>
        </p>
      </div>

      <div className="flex flex-col items-center justify-center">
        <div className="w-12 text-6xl text-black m-auto mb-2">
          <GoPackageDependencies />
        </div>

        <p className="font-semibold">Return Policy</p>
        <p className="text-gray-400">
          5 days after purchase <br /> if the item isn’t the same as what was
          ordered
        </p>
      </div>
    </div>
  );
};

export default Policy;
