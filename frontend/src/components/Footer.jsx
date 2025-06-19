import React from "react";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr_1fr] gap-14 my-10 mt-40 text-sm ">
        <div className="">
          <img src={assets.logo_dark} alt="" className="mb-5 w-32" />
          <p className="w-full md:w-2/3 text-gray-600">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam
            voluptatum, quia, voluptas, voluptates quo quos quas quibusdam
            quisquam voluptatum.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium md-5">ABOUT US</p>
          <ul className="flex flex-col gap-1 text-color-gray-600">
            <li>Our Story`</li>
            <li>FAQs</li>
            <li>Shipping & Returns</li>
            <li>Contact Us</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">SHOP</p>
          <ul className="flex flex-col gap-1 text-color-gray-600">
            <li>Jewelry</li>
            <li>Clothings</li>
            <li>Hair Wigs</li>
            <li>Rere Collection</li>
            <li>Size Guide</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">FOLLOW US</p>
          <ul className="flex flex-col gap-1 text-color-gray-600">
            <li>Instagram</li>
            <li>Facebook</li>
            <li>Twitter</li>
          </ul>
        </div>
      </div>

      <div className="">
        <hr />
        <p className="py-5 text-sm text-center">
          &copy; 2024 Aesthesia Haven - All Rights Reserved
        </p>
      </div>
    </div>
  );
};

export default Footer;
