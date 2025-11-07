import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

const Banner = ({
  image,
  bannerText,
  overlayStyle = "dark", // dark, gradient-1, gradient-2, gradient-3
  textSize = "default", // small, default, large
  textStyle = "default", // default, elegant, bold, minimal
  verticalPosition = "25%", // Control image vertical position
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsLoaded(false);
    const img = new Image();
    img.src = image;
    img.onload = () => setIsLoaded(true);
  }, [image]);

  // Overlay styles
  const overlayStyles = {
    dark: "bg-black/30",
    "gradient-1": "bg-gradient-to-b from-black/50 to-transparent",
    "gradient-2": "bg-gradient-to-b from-black/40 via-black/20 to-black/40",
    "gradient-3": "bg-gradient-to-r from-black/40 via-transparent to-black/40",
  };

  // Text size styles
  const textSizes = {
    small: "text-2xl md:text-3xl",
    default: "text-2xl md:text-3xl lg:text-4xl",
    large: "text-2xl md:text-4xl lg:text-4xl",
  };

  // Text style variants
  const textStyles = {
    default: "font-bold text-white drop-shadow-lg",
    elegant: "font-light text-white tracking-wider drop-shadow-md",
    bold: "font-extrabold text-white uppercase tracking-tight drop-shadow-xl",
    minimal: "font-medium text-white/90 tracking-normal",
  };

  return (
    <div
      className="relative min-h-[400px] h-[50vh] md:h-[60vh] lg:h-[60vh] overflow-hidden"
      style={{
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        zIndex: 0,
      }}
    >
      {/* Image container with overlay (full-bleed) */}
      <div className={`absolute inset-0`}>
        <img
          src={image}
          alt={bannerText}
          className="w-full h-full object-cover object-center transition-transform duration-[2s] hover:scale-105"
          style={{
            objectPosition: `50% ${verticalPosition}`,
          }}
          onLoad={() => setIsLoaded(true)}
        />
        {/* Gradient/Dark overlay */}
        <div
          className={`absolute inset-0 ${overlayStyles[overlayStyle]}`}
        ></div>
      </div>

      {/* Text container with animation */}
      <div
        className={`relative h-full flex items-center justify-center px-4 transition-all duration-1000 transform ${
          isLoaded ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"
        }`}
      >
        <h1
          className={`${textSizes[textSize]} ${textStyles[textStyle]} text-center max-w-4xl`}
        >
          {bannerText}
        </h1>
      </div>
    </div>
  );
};

export default Banner;
