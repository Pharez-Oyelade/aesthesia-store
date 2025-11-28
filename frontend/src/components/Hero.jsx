import React, { useState, useEffect, useRef } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    image: assets.bg_main_4,
    image_mobile: assets.bg_main_4_mobile,
    title: "UNFOLD -  A Celebration of Quiet Evolution",
    subtitle: "Explore our Latest Collection",
    b_text: "UNFOLD",
    link: "/collection/unfold",
  },
  {
    image: assets.size_bg,
    image_mobile: assets.size_bg,
    title: "EMBRACE YOUR BEAUTIFUL",
    subtitle: "Browse our Collection",
    b_text: "SHOP NOW",
    link: "/collection",
  },
  {
    image: assets.bg_2_main,
    image_mobile: assets.bg_2_main_mobile,
    title: "AESTHESIA...",
    subtitle: "Where women see themselves again",
    b_text: "ABOUT US",
    link: "/about",
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

const Hero = () => {
  const [current, setCurrent] = useState(0);

  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 768 : false
  );

  useEffect(() => {
    const mql = window.matchMedia("(max-width: 768px)");
    const handler = (e) => setIsMobile(e.matches);
    // set initial state
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
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  // preload cache to avoid re-creating Image objects repeatedly
  const preloadCache = useRef(new Map());

  useEffect(() => {
    const nextIndex = (current + 1) % slides.length;
    const nextSrc = isMobile
      ? slides[nextIndex].image_mobile
      : slides[nextIndex].image;

    if (!preloadCache.current.has(nextSrc)) {
      const img = new Image();
      img.src = nextSrc;
      // store immediately so we don't create duplicates
      preloadCache.current.set(nextSrc, img);
    }
  }, [current, isMobile]);

  const {
    image: imageDesktop,
    image_mobile: imageMobile,
    title,
    subtitle,
    b_text,
    link,
  } = slides[current];

  const bgImage = isMobile ? imageMobile : imageDesktop;
  const srcSet = `${imageMobile} 600w, ${imageDesktop} 1200w`;
  const sizes = `(max-width: 768px) 100vw, 100vw`;

  // Variants for staggered text animation
  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { staggerChildren: 0.2, duration: 0.6, ease: "easeOut" },
    },
    exit: { opacity: 0, y: -30, transition: { duration: 0.4 } },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  return (
    <div className="relative w-full h-dvh flex items-center justify-center overflow-hidden pt-0">
      {/* Background transition */}
      <AnimatePresence mode="wait">
        <motion.img
          key={bgImage}
          src={bgImage}
          srcSet={srcSet}
          sizes={sizes}
          alt={title}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ willChange: "transform, opacity" }}
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, ease: "easeInOut" }}
        />
      </AnimatePresence>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/40 z-10" />

      {/* Slide Content */}
      <div className="relative z-20 flex items-center justify-center w-full h-full">
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center text-center text-white px-4"
          >
            <motion.h1
              variants={childVariants}
              className="text-3xl sm:text-5xl font-medium mb-4 drop-shadow-lg prata-regular"
            >
              {title}
            </motion.h1>
            <motion.p
              variants={childVariants}
              className="text-md w-[75%] sm:w-[100%] sm:text-lg font-medium drop-shadow-md"
            >
              {subtitle}
            </motion.p>
            <Link to={link}>
              <motion.button
                variants={childVariants}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="mt-10 px-10 py-3 rounded-full bg-gradient-to-r from-[#691110] to-pink-800 hover:from-red-900 hover:to-pink-800 text-white text-lg font-bold shadow-lg tracking-wide transition-all duration-300 border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-red-300"
              >
                {b_text}
              </motion.button>
            </Link>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dots */}
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
