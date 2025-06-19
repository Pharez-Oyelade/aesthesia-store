import React from "react";
import { useLocation } from "react-router-dom";
import { assets } from "../assets/assets";

const Banner = () => {
  const location = useLocation();

  let background, text;

  if (location.pathname === "/clothing") {
    background = assets.the_kali;
    text = "CLOTHINGS";
  } else if (location.pathname === "/wigs") {
    background = assets.hair_bg;
    text = "WIGS";
  } else if (location.pathname === "/jewelry") {
    background = assets.jewelry_bg;
    text = "JEWELRY";
  } else if (location.pathname === "/rere-collection") {
    background = assets.main_1;
    text = "RERE COLLECTION";
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
