import React, { useContext, useEffect, useState } from "react";
import { shopContext } from "../context/ShopContext";
import { useLocation } from "react-router-dom";
import { MdOutlineSearch } from "react-icons/md";
import { assets } from "../assets/assets";

const SearchBar = () => {
  const { search, setSearch, showSearch, setShowSearch } =
    useContext(shopContext);
  const [isVisible, setIsVisible] = useState(false);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("collection")) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  }, [location]);

  return showSearch && isVisible ? (
    <div className="px-4 mt-20 pt-5">
      <div className="w-full text-center">
        <div className="inline-flex items-center justify-center border border-gray-400 bg-white px-5 py-2 mx-3 rounded-full w-3/4 sm:w-1/2">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            type="text"
            placeholder="Search Collections"
            className="flex-1 outline-none bg-inherit text-sm"
          />
          <MdOutlineSearch />
        </div>
        <img
          src={assets.cross_icon}
          className="inline w-3 cursor-pointer"
          alt=""
          onClick={() => setShowSearch(false)}
        />
      </div>
    </div>
  ) : null;
};

export default SearchBar;
