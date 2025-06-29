import React from "react";
import { assets } from "../assets/assets";

const Navbar = ({ setToken }) => {
  return (
    <div className="">
      <div className="flex items-center py-4 px-8 justify-between bg-white shadow-md rounded-b-2xl">
        <div className="flex flex-col items-center">
          <img src={assets.logo_dark} className="w-32 md:w-40" alt="" />
          <p className="text-sm font-bold text-gray-700 tracking-wide">
            ADMIN <span className="text-red-700 font-semibold">PANEL</span>
          </p>
        </div>
        <button
          onClick={() => setToken("")}
          className="bg-red-700 hover:bg-red-800 transition text-white px-6 py-2 rounded-full text-base font-semibold shadow"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
