import React from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr_1fr] gap-14 my-10 mt-40 text-sm ">
        <div className="">
          <img
            src={assets.aesthesia_logo_footer}
            alt=""
            className="mb-5 w-20"
          />
          <p className="w-full md:w-2/3 text-gray-600">
            Your Wardrobe deserves more than ordinary. At Aesthesia, we deliver
            bold styles and soft elegance for women who know what they want.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">ABOUT US</p>
          <ul className="flex flex-col gap-1 text-color-gray-600">
            <HashLink smooth to="/about#policies">
              <li className="cursor-pointer">Our Policies</li>
            </HashLink>
            <HashLink smooth to="/about#faqs">
              <li className="cursor-pointer">FAQs</li>
            </HashLink>
            <li className="cursor-pointer">Shipping & Returns</li>
            <Link to="/contact">
              <li className="cursor-pointer">Contact Us</li>
            </Link>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">SHOP</p>
          <ul className="flex flex-col gap-1 text-color-gray-600">
            <Link to="/clothing">
              <li className="cursor-pointer">Clothings</li>
            </Link>
            <Link to="/jewelry">
              <li className="cursor-pointer">Jewelry</li>
            </Link>
            <Link to="/wigs">
              <li className="cursor-pointer">Hair Wigs</li>
            </Link>
            <Link to="/rere-collection">
              <li className="cursor-pointer">Rere Collection</li>
            </Link>
            <li className="cursor-pointer">Size Guide</li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">FOLLOW US</p>
          <ul className="flex flex-col gap-1 text-color-gray-600">
            <li className="cursor-pointer">
              <a href="https://www.facebook.com/profile.php?id=61569345876696">
                Facebook
              </a>
            </li>

            <li className="cursor-pointer">
              <a href="https://www.instagram.com/aesthesia_haven">Instagram</a>
            </li>

            <li className="cursor-pointer">
              <a href="https://www.instagram.com/aesthesia_hair">
                Aesthesia Hair
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="">
        <hr />
        <p className="py-5 text-sm text-center">
          &copy; 2025 Aesthesia Haven - All Rights Reserved | website by{" "}
          <a
            className="text-red-600"
            href="https://pharez-oyelade.github.io/my-portfolio/"
          >
            Pharez
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
