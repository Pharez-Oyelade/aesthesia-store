import React from "react";
import { NavLink } from "react-router-dom";
import { assets } from "../assets/assets";

const Sidebar = () => {
  return (
    <div className="w-[20%] min-h-screen bg-gradient-to-b from-white to-gray-100 border-r-2 border-gray-200 shadow-lg rounded-tr-2xl">
      <div className="flex flex-col  gap-6 pt-10 pl-2 sm:pl-8 text-lg font-medium">
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-red-100 text-red-700 shadow"
                : "hover:bg-gray-100 text-gray-700"
            }`
          }
          to="/add"
        >
          <img className="w-6 h-6" src={assets.add_icon} alt="" />
          <span className="hidden sm:block">Add Items</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-red-100 text-red-700 shadow"
                : "hover:bg-gray-100 text-gray-700"
            }`
          }
          to="/list"
        >
          <img className="w-6 h-6" src={assets.order_icon} alt="" />
          <span className="hidden sm:block">List Items</span>
        </NavLink>
        <NavLink
          className={({ isActive }) =>
            `flex items-center w-full gap-4 px-4 py-3 rounded-xl transition-all duration-200 ${
              isActive
                ? "bg-red-100 text-red-700 shadow"
                : "hover:bg-gray-100 text-gray-700"
            }`
          }
          to="/orders"
        >
          <img className="w-6 h-6" src={assets.order_icon} alt="" />
          <span className="hidden sm:block">Orders</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;
