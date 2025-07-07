import React from "react";
import { useLocation } from "react-router-dom";
import { assets } from "../assets/assets";

const Banner = () => {
  const location = useLocation();

  let background, text;

  if (location.pathname === "/clothing") {
    background = assets.bg_3_main;
    text = "CLOTHINGS";
  } else if (location.pathname === "/wigs") {
    background = assets.hair_bg;
    text = "WIGS";
  } else if (location.pathname === "/jewelry") {
    background = assets.jewelry_bg;
    text = "JEWELRY";
  } else if (location.pathname === "/rere-collection") {
    background = assets.bg_1_main;
    text = "RERE COLLECTION";
  } else if (location.pathname === "/about") {
    background = assets.bg_main_1;
    text = "ABOUT US";
  }

  return (
    <div
      style={{
        backgroundImage: `url(${background})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "300px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: "#fff",
        marginTop: "0",
        paddingTop: "0",
      }}
    >
      <h1 className="text-5xl">{text}</h1>
    </div>
  );
};

export default Banner;
