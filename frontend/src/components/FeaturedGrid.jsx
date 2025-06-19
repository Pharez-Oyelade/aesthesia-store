import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";

const FeaturedGrid = () => {
  const images = [
    assets.main_1,
    assets.jewelry_bg,
    assets.hair_bg,
    assets.the_kali,
  ];

  const overlays = [
    {
      title: "PLATINUM COLLECTION",
      desc: "Elevate Your Everyday, Modern Classics Reimagined",
      link: "/rere-collection",
    },
    {
      title: "Jewelry",
      desc: "Explore our latest jewelry collection.",
      link: "/jewelry",
    },
    {
      title: "Hair Wigs",
      desc: "Transform your look with our premium hair wigs.",
      link: "/wigs",
    },
    {
      title: "Clothings",
      desc: "Discover our exclusive clothing line.",
      link: "/clothing",
    },
  ];
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]  pt-10">
      {/* <div className="flex items-center justify-center mb-6 text-3xl">
        <Title text1="FEATURED" text2="SECTIONS" />
      </div> */}

      <div className="grid grid-cols-2 gap-4 gap-y-3 mb-20">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="group overflow-hidden relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] cursor-pointer"
          >
            <img
              src={img}
              alt="Featured"
              className="absolute top-0 left-0 w-full h-full object-cover object-right group-hover:scale-120 transition-transform duration-700 ease-in-out"
            />
            <div className="absolute inset-0 bg-white/40 background-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
            <div className="absolute inset-0 flex flex-col justify-center pl-12 text-black max-w-md  pointer-events-none z-10">
              {/* <p>AESTHESIA</p> */}
              <h2 className="text-black text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                {overlays[idx].title}
                <p className="text-black text-xs sm:text-sm md:text-base mb-4">
                  {overlays[idx].desc}
                </p>
              </h2>

              <a
                href={overlays[idx].link}
                className="inline-block w-[120px] text-black font-semibold px-5 py-2 hover:underline underline-offset-4 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 pointer-events-auto"
              >
                Shop Now
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedGrid;
