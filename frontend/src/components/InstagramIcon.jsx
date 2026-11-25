import React, { useEffect, useState } from "react";
import { FaInstagram } from "react-icons/fa";
import { useLocation } from "react-router-dom";

const InstagramIcon = () => {
  const [isHelpVisible, setIsHelpVisible] = useState(false);
  const { pathname } = useLocation();
  const isProductPage = pathname.startsWith("/product/");

  // show help text with timeout and hide after 3 seconds
  const showHelpText = () => {
    setIsHelpVisible(true);
    setTimeout(() => {
      setIsHelpVisible(false);
    }, 5000);
  };

  // show help text when the component mounts
  useEffect(() => {
    const timer = setTimeout(() => {
      showHelpText();
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      className={`fixed z-40 hover:scale-110 transition-transform duration-200 flex flex-row-reverse gap-3 items-center justify-center ${
        isProductPage
          ? "bottom-28 right-4 md:bottom-8 md:right-8"
          : "bottom-8 right-8"
      }`}
    >
      <a
        href="https://ig.me/m/aesthesia_haven"
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-tr from-[#f09433] via-[#e6683c] to-[#bc1888] rounded-full shadow-xl hover:shadow-2xl transition-shadow duration-300 text-white"
        aria-label="Instagram"
      >
        <FaInstagram className="w-7 h-7 sm:w-8 sm:h-8" />
      </a>

      {isHelpVisible && (
        <div className=" mb-2 bg-black text-white text-xs sm:text-sm py-2 px-4 rounded-lg shadow-lg">
          <p>Need help? Contact us on Instagram!</p>
        </div>
      )}
    </div>
  );
};

export default InstagramIcon;
