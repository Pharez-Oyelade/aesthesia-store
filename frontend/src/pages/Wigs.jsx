import React from "react";
import Banner from "../components/Banner";
import CollectionDisplay from "../components/CollectionDisplay";
import { assets } from "../assets/assets";

const Wigs = () => {
  return (
    <div className="px-4 sm:px-10 lg:px-20 shadow-md pb-10">
      {/* <Banner /> */}
      <div className="w-full min-h-[50vh] md:h-[70vh] mt-35 md:mt-40 rounded-3xl md:rounded-[2.5rem] flex flex-col md:flex-row items-center relative overflow-hidden shadow-2xl border border-red-50 group">
        {/* Background Image (Message Card) */}
        <div className="absolute inset-0 z-0 bg-[#fdf2f2]">
          <img
            src={assets.message_card}
            alt="Message Card Background"
            className="w-full h-full object-cover object-center opacity-90 transition-transform duration-1000 md:group-hover:scale-105"
          />
          {/* Overlays for text readability */}
          <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-white/80 via-white/80 to-black/20 md:to-transparent"></div>
        </div>

        {/* Text Section (Left) */}
        <div className="text-center md:text-left flex flex-col items-center md:items-start z-10 w-full md:w-[55%] px-6 md:px-16 lg:px-24 relative h-full justify-center pt-10 pb-36 md:py-0">
          <h1 className="outfit-bold text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] tracking-tight text-red-950 mb-4 md:mb-6 leading-[1.1]">
            STILL HER
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-red-900 font-light tracking-wide mb-8 md:mb-10 max-w-md drop-shadow-sm">
            Hair made effortless. A reminder to show up for yourself, boldly and
            beautifully.
          </p>
          {/* <a
            href="#collection"
            className="px-8 py-4 bg-red-900 text-white rounded-full text-sm font-medium tracking-widest uppercase hover:bg-black transition-all duration-300 shadow-xl shadow-red-900/20 hover:-translate-y-1"
          >
            Shop Collection
          </a> */}
        </div>

        {/* Floating Product Card (Right/Bottom) */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:bottom-12 md:right-12 z-20 bg-white/85 backdrop-blur-lg p-3 md:p-4 rounded-[2rem] shadow-2xl flex items-center gap-4 w-[90%] sm:w-[400px] md:w-[380px] lg:w-[420px] border border-white/60 group/card cursor-pointer hover:bg-white transition-colors duration-300">
          <div className="w-24 h-24 md:w-28 md:h-28 lg:w-32 lg:h-32 rounded-2xl overflow-hidden bg-[#fcf2f2] flex-shrink-0 p-2 flex items-center justify-center">
            <img
              src={assets.still_her}
              alt="Still Her Box"
              className="w-full h-full object-contain mix-blend-multiply group-hover/card:scale-110 transition-transform duration-500"
            />
          </div>
          <div className="flex flex-col justify-center flex-1 pr-2">
            <h3 className="outfit-bold text-red-950 text-base md:text-lg lg:text-xl">
              The Still Her Box
            </h3>
            <p className="text-gray-600 text-xs md:text-sm mt-1 mb-2 md:mb-3 line-clamp-2 leading-snug">
              Everything you need for effortless beauty in one elegant box.
            </p>
            <div className="flex justify-between items-center w-full mt-1">
              <span className="outfit-bold text-red-900 text-sm md:text-base">
                Free with order
              </span>
            </div>
          </div>
        </div>
      </div>

      <div id="#collection">
        <CollectionDisplay section="wigs" />
      </div>
    </div>
  );
};

export default Wigs;
