import React from "react";
import Title from "./Title";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const FeaturedGrid = () => {
  const images = [
    assets.bg_main_4_mobile,
    assets.bg_3_main,
    assets.bg_1_main,
    assets.bg_2_main,
  ];

  const overlays = [
    {
      title: "UNFOLD",
      desc: "A Celebration of Quiet Evolution",
      link: "/collection/unfold",
    },
    {
      title: "THE COLOR CODE COLLECTION",
      desc: "Where Color becomes emotion- and emotion becomes you",
      link: "/collection/the color code collection",
    },
    {
      title: "THE RERE COLLECTION",
      desc: "Where new life meets timeless grace",
      link: "/collection/the rere collection",
    },
    {
      title: "All Collections",
      desc: "Explore our diverse range of collections",
      link: "/collection",
    },
  ];
  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]  pt-10">

      <div className="grid grid-row sm:grid-cols-2 gap-4 gap-y-3 mb-20">
        {images.map((img, idx) => (
          <div
            key={idx}
            className="group overflow-hidden relative h-[300px] sm:h-[350px] md:h-[400px] lg:h-[450px] cursor-pointer rounded-2xl"
          >
            <Link to={overlays[idx].link}>
              <img
                src={img}
                alt="Featured"
                className="absolute top-0 left-0 w-full h-full object-cover object-right group-hover:scale-120 transition-transform duration-700 ease-in-out"
              />
              <div className="absolute inset-0 bg-black/40 background-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
              <div className="absolute inset-0 flex flex-col justify-center pl-12 max-w-md  pointer-events-none z-10">
                {/* <p>AESTHESIA</p> */}
                <h2 className="text-white text-xl sm:text-2xl md:text-3xl font-bold mb-2">
                  {overlays[idx].title}
                  <p className="text-white text-xs sm:text-sm md:text-base mb-4">
                    {overlays[idx].desc}
                  </p>
                </h2>

                <p className="inline-block w-[120px] text-white font-semibold py-2 hover:underline underline-offset-4 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-300 pointer-events-auto">
                  Shop Now
                </p>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeaturedGrid;
