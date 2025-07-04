import React, { useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const slides = [
  {
    image: assets.bg_5,
    title: "MODERN, CLASSIC, ELEGANT",
    subtitle:
      "Where confidence meets fashion - discover wigs, jewelry, and outfits for your everyday slay",
    b_text: "BROWSE COLLECTION",
    link: "/collection",
  },
  {
    image: assets.bg_4,
    title: "REDEFINING BEAUTY",
    subtitle: "Learn more about our story",
    b_text: "ABOUT US",
    link: "/about",
  },
  {
    image: assets.green_main,
    title: "STYLED TO RULE. SLAY BOLD. SHINE LOUD",
    subtitle: "Contact us for more information",
    b_text: "CONTACT",
    link: "/contact",
  },
  {
    image: assets.hero_img,
    title: "UNLEASH YOUR EVERYDAY POWER",
    subtitle: "Discover what greatness feels like",
    b_text: "RERE COLLECTION",
    link: "/rere-collection",
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => {
      clearInterval(interval);
    };
  }, [current]);

  const { image, title, subtitle, b_text, link } = slides[current];

  return (
    <div
      className="relative w-full h-screen flex items-center justify-center overflow-hidden transition-all duration-700 pt-0"
      style={{
        backgroundImage: image ? `url(${image})` : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
        transition: "background-image 0.7s cubic-bezier(0.4,0,0.2,1)",
      }}
    >
      <div className="absolute inset-0 bg-black/40 z-10 transition-all duration-700" />
      <div
        className="relative z-20 flex flex-col items-center justify-center w-full h-full text-center text-white transition-all duration-700 opacity-100 translate-y-0"
        style={{ transitionProperty: "opacity, transform" }}
      >
        <h1 className="text-3xl sm:text-5xl font-medium mb-4 drop-shadow-lg prata-regular">
          {title}
        </h1>
        <p className="text-lg sm:text-md font-medium drop-shadow-md">
          {subtitle}
        </p>
        <Link to={link}>
          {/* <button className="mt-10 px-10 py-3 rounded-full bg-gradient-to-r from-red-700 to-pink-600 hover:from-red-800 hover:to-pink-700 text-white text-lg font-bold shadow-lg tracking-wide transition-all duration-300 border-2 border-white/20 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-300">
            {b_text}
          </button> */}

          <button className=" group hover:bg-red-600 hover:shadow-xl transition-all duration-300 text-xl relative mt-5 px-10 py-5 text-white group overflow-hidden cursor-pointer">
            <span className="absolute text-red-600 top-0 left-0 w-3 h-3 border-t-3 border-l-3 transition-all duration-300"></span>
            <span className="absolute text-red-600 top-0 right-0 w-3 h-3 border-t-3 border-r-3 transition-all duration-300"></span>
            <span className="absolute text-red-600 bottom-0 left-0 w-3 h-3 border-b-3 border-l-3 transition-all duration-300"></span>
            <span className="absolute text-red-600 bottom-0 right-0 w-3 h-3 border-b-3 border-r-3 transition-all duration-300"></span>

            <span className="absolute inset-0 border-3 border-red-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
            {b_text}
          </button>
        </Link>
      </div>
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-30">
        {slides.map((_, idx) => (
          <span
            key={idx}
            className={`w-3 h-3 rounded-full bg-white transition-all duration-300 ${
              current === idx ? "opacity-100" : "opacity-40"
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default Hero;
