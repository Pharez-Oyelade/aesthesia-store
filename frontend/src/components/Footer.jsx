import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr_1fr] gap-14 my-10 mt-40 text-sm ">
        <div className="">
          <img src={assets.logo_dark} alt="" className="mb-5 w-32" />
          <p className="w-full md:w-2/3 text-gray-600">
            Your Wardrobe deserves more than ordinary. At Aesthesia, we deliver
            bold styles and soft elegance for women who know what they want.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium md-5">ABOUT US</p>
          <ul className="flex flex-col gap-1 text-color-gray-600">
            <li className="cursor-pointer">Our Story`</li>
            <li className="cursor-pointer">FAQs</li>
            <li className="cursor-pointer">Shipping & Returns</li>
            <li className="cursor-pointer">Contact Us</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">SHOP</p>
          <ul className="flex flex-col gap-1 text-color-gray-600">
            <li className="cursor-pointer">Jewelry</li>
            <li className="cursor-pointer">Clothings</li>
            <li className="cursor-pointer">Hair Wigs</li>
            <li className="cursor-pointer">Rere Collection</li>
            <li className="cursor-pointer">Size Guide</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">FOLLOW US</p>
          <ul className="flex flex-col gap-1 text-color-gray-600">
            <li className="cursor-pointer">Instagram</li>
            <li className="cursor-pointer">Facebook</li>
            <li className="cursor-pointer">Twitter</li>
          </ul>
        </div>
      </div>

      <div className="">
        <hr />
        <p className="py-5 text-sm text-center">
          &copy; 2025 Aesthesia Haven - All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
