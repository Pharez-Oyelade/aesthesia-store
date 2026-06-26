import React, { useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";

const slides = [
  {
    image: assets.first_bloom2,
    image_mobile: assets.first_bloom2,
    title: "First Bloom - A Fresh Palette",
    subtitle: "Your favorite silhouette, now blossoming in two new colorways",
    b_text: "SHOP NOW",
    link: "/product/6928eb30d56b7f9f684dd2cf",
  },
  {
    image: assets.peace4,
    image_mobile: assets.peace4,
    title: "Àlàáfíà - Peace",
    subtitle: "Experience the signature Àlàáfíà, reimagined in Green and Purple",
    b_text: "SHOP NOW",
    link: "/product/6928e4a7d56b7f9f684dd04e",
  },
  {
    image: assets.first_bloom3,
    image_mobile: assets.first_bloom3,
    title: "FIRST BLOOM RETURNS",
    subtitle: "Where confidence blossoms in every shade - Magenta & Onion and Soft Blue & Pastel Yellow",
    b_text: "SHOP NOW",
    link: "/product/6928eb30d56b7f9f684dd2cf",
  },
  {
    image: assets.first_bloom1,
    image_mobile: assets.first_bloom1,
    title: "FIRST BLOOM - Bloom in your own color",
    subtitle: "Now reintroduced in beloved hues and soft new tones",
    b_text: "SHOP NOW",
    link: "/product/6928eb30d56b7f9f684dd2cf",
  },
  {
    image: assets.bg_1_main,
    image_mobile: assets.bg_1_main_mobile,
    title: "EMBRACE YOUR BEAUTIFUL",
    subtitle: "Browse our Collection",
    b_text: "SHOP NOW",
    link: "/collection",
  },
  {
    image: assets.bg_3_main,
    image_mobile: assets.bg_3_main_mobile,
    title: "GET IN TOUCH WITH US",
    subtitle: "We would love to hear from you",
    b_text: "CONTACT",
    link: "/contact",
  },
];

const mobileAdditionalSlides = [
  {
    image: assets.first_bloom2,
    image_mobile: assets.first_bloom2,
    title: "FIRST BLOOM",
    subtitle: "Your favorite piece, now blossoming in two new colorways",
    b_text: "SHOP NOW",
    link: "/product/6928eb30d56b7f9f684dd2cf",
  },
  {
    image: assets.alaafia_bg_mobile_2,
    image_mobile: assets.alaafia_bg_mobile_2,
    title: "Àlàáfíà - Peace",
    subtitle: "Experience the signature Àlàáfíà, reimagined in Green and Purple",
    b_text: "SHOP NOW",
    link: "/product/6928e4a7d56b7f9f684dd04e",
  },
  {
    image: assets.first_bloom3,
    image_mobile: assets.first_bloom3,
    title: "FIRST BLOOM RETURNS",
    subtitle: "Where confidence blossoms in every shade - Magenta & Onion and Soft Blue & Pastel Yellow",
    b_text: "SHOP NOW",
    link: "/product/6928eb30d56b7f9f684dd2cf",
  },
  {
    image: assets.first_bloom1,
    image_mobile: assets.first_bloom1,
    title: "FIRST BLOOM - Bloom in your own color",
    subtitle: "Now reintroduced in beloved hues and soft new tones",
    b_text: "SHOP NOW",
    link: "/product/6928eb30d56b7f9f684dd2cf",
  },
  {
    image: assets.bg_main_4_mobile,
    image_mobile: assets.bg_main_4_mobile,
    title: "UNFOLD -  A Celebration of Quiet Evolution",
    subtitle: "Explore our Latest Collection",
    b_text: "UNFOLD",
    link: "/collection/unfold",
  },
  {
    image: assets.bg_1_main,
    image_mobile: assets.bg_1_main_mobile,
    title: "EMBRACE YOUR BEAUTIFUL",
    subtitle: "Browse our Collection",
    b_text: "SHOP NOW",
    link: "/collection",
  },
];

const Hero = () => {
  const [current, setCurrent] = useState(0);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false,
  );

  const getSlideArray = (mobile) => {
    return mobile ? mobileAdditionalSlides : slides;
  };

  const currentSlides = getSlideArray(isMobile);

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const handler = (e) => {
      setIsMobile(e.matches);
      setCurrent(0);
    };
    try {
      handler(mql);
    } catch (e) {
      // ignore
    }
    if (mql.addEventListener) mql.addEventListener("change", handler);
    else if (mql.addListener) mql.addListener(handler);
    return () => {
      if (mql.removeEventListener) mql.removeEventListener("change", handler);
      else if (mql.removeListener) mql.removeListener(handler);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % currentSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [currentSlides.length]);

  const preloadCache = useRef(new Map());

  useEffect(() => {
    const nextIndex = (current + 1) % currentSlides.length;
    const nextSrc = isMobile
      ? currentSlides[nextIndex].image_mobile
      : currentSlides[nextIndex].image;

    if (!preloadCache.current.has(nextSrc)) {
      const img = new Image();
      img.src = nextSrc;
      preloadCache.current.set(nextSrc, img);
    }
  }, [current, isMobile, currentSlides]);

  const {
    image: imageDesktop,
    image_mobile: imageMobile,
    title,
    subtitle,
    b_text,
    link,
  } = currentSlides[current];

  const bgImage = isMobile ? imageMobile : imageDesktop;
  const srcSet = `${imageMobile} 600w, ${imageDesktop} 1200w`;
  const sizes = `(max-width: 768px) 100vw, 100vw`;

  const imgWidth = isMobile ? 600 : 1200;
  const imgHeight = isMobile ? 800 : 800;

  return (
    <div className="relative w-full h-dvh flex items-center justify-center overflow-hidden pt-0 bg-black">
      {/* Background image */}
      <img
        key={bgImage}
        src={bgImage}
        srcSet={srcSet}
        sizes={sizes}
        alt={title}
        width={imgWidth}
        height={imgHeight}
        className="absolute inset-0 w-full h-full object-cover animate-hero-zoom"
        fetchPriority="high"
        loading="eager"
      />

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Slide Content */}
      <div className="relative z-20 flex items-center justify-center w-full h-full">
        <div
          key={current}
          className="flex flex-col items-center text-center text-white px-4"
        >
          <h1 className="text-3xl sm:text-5xl font-medium mb-4 drop-shadow-lg outfit-bold">
            {title}
          </h1>
          <p className="text-md w-[75%] sm:w-[100%] sm:text-lg font-medium drop-shadow-md">
            {subtitle}
          </p>

          <Link to={link}>
            <button className="mt-10 px-10 py-3 rounded-full bg-gradient-to-r from-[#691110] to-pink-800 hover:from-red-900 hover:to-pink-800 text-white text-lg font-bold shadow-lg tracking-wide transition-all duration-300 border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-red-300 hover:scale-105 active:scale-95">
              {b_text}
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
