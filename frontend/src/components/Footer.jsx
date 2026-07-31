import React from "react";
import { Link } from "react-router-dom";
import { HashLink } from "react-router-hash-link";
import { assets } from "../assets/assets";

const Footer = () => {
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      <div className="flex flex-col sm:grid grid-cols-[3fr_1fr_1fr_1fr] gap-14 my-10 mt-10 sm:mt-30 text-sm ">
        <div className="">
          <img
            src={assets.aesthesia_logo_footer}
            alt=""
            className="mb-5 w-20"
            width={80}
            height={80}
          />
          <p className="w-full md:w-2/3 text-gray-600">
            Aesthesia…Where women see themselves again.
          </p>
          <p className="w-full md:w-2/3 text-gray-600">
            A space where every woman can see herself again, in her color, in
            her confidence, in her truth.
          </p>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">ABOUT US</p>
          <ul className="flex flex-col gap-1 text-color-gray-600">
            <li>
              <HashLink smooth to="/about#policies">
                Our Policies
              </HashLink>
            </li>

            <li className="cursor-pointer">
              <HashLink smooth to="/about#faqs">
                FAQs
              </HashLink>
            </li>

            <li>
              <Link to="/shipping-policy">Shipping Policy</Link>
            </li>

            <li className="cursor-pointer">
              <Link to="/contact">Contact Us</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">SHOP</p>
          <ul className="flex flex-col gap-1 text-color-gray-600">
            <li className="cursor-pointer">
              <Link to="/collection">Collection</Link>
            </li>

            <li className="cursor-pointer">
              <Link to="/collection/unfold">Unfold</Link>
            </li>

            <li className="cursor-pointer">
              C
              <Link to="/collection/the color code collection">
                Color Code Collection
              </Link>
            </li>

            <li className="cursor-pointer">
              <Link to="/collection/the rere collection">RERE Collection</Link>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-xl font-medium mb-5">FOLLOW US</p>
          <ul className="flex flex-col gap-1 text-color-gray-600">
            <li className="cursor-pointer">
              <a
                href="https://www.facebook.com/profile.php?id=61569345876696"
                target="_blank"
              >
                Facebook
              </a>
            </li>

            <li className="cursor-pointer">
              <a
                href="https://www.instagram.com/aesthesia_haven"
                target="_blank"
              >
                Instagram
              </a>
            </li>

            <li className="cursor-pointer">
              <a
                href="https://www.instagram.com/aesthesia_hair"
                target="_blank"
              >
                Aesthesia Hair
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="">
        <hr />
        <p className="py-5 text-sm text-center">
          &copy; 2025{" "}
          {new Date().getFullYear() > 2025 && `-${new Date().getFullYear()}`}
          Aesthesia Haven - All Rights Reserved | website by{" "}
          <a
            className="text-red-600 font-bold underline"
            href="https://pharez-portfolio.vercel.app/"
          >
            Pharez
          </a>
        </p>
      </div>
    </div>
  );
};

export default Footer;
