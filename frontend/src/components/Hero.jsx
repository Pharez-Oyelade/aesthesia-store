import React, { useState, useEffect, useMemo } from "react";
import { assets } from "../assets/assets";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    image: assets.bg_main_1,
    title: "MODERN, CLASSIC, ELEGANT",
    subtitle:
      "Where confidence meets fashion - discover wigs, jewelry, and outfits for your everyday slay",
    b_text: "BROWSE COLLECTION",
    link: "/collection",
  },
  {
    image: assets.bg_1_main,
    title: "REDEFINING BEAUTY",
    subtitle: "Learn more about our story",
    b_text: "ABOUT US",
    link: "/about",
  },
  {
    image: assets.bg_2_main,
    title: "STYLED TO RULE. SLAY BOLD. SHINE LOUD",
    subtitle: "Contact us for more information",
    b_text: "CONTACT",
    link: "/contact",
  },
  {
    image: assets.bg_3_main,
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
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const nextIndex = (current + 1) % slides.length;
    const nextImg = new Image();
    nextImg.src = slides[nextIndex].image;
  }, [current]);

  const { image, title, subtitle, b_text, link } = slides[current];

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
    <div className="relative w-full h-screen flex items-center justify-center overflow-hidden pt-0">
      {/* Background transition */}
      <AnimatePresence mode="wait">
        <motion.div
          key={image}
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `url(${image})`,
            willChange: "transform, opacity",
          }}
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
            key={current} // re-triggers animation when slide changes
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
                className="mt-10 px-10 py-3 rounded-full bg-gradient-to-r from-[#691110] to-pink-700 hover:from-red-800 hover:to-pink-700 text-white text-lg font-bold shadow-lg tracking-wide transition-all duration-300 border-2 border-white/20 focus:outline-none focus:ring-2 focus:ring-red-300"
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
