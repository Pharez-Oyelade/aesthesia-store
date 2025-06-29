import React, { useContext, useEffect, useRef, useState } from "react";
import { MdOutlineShoppingCart } from "react-icons/md";
import { MdOutlineSearch } from "react-icons/md";
import { CgProfile } from "react-icons/cg";
import { RiMenuFoldLine } from "react-icons/ri";
import { MdOutlineClose } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa6";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { shopContext } from "../context/ShopContext";

const Navbar = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showUserDropdown, setShowUserDropdown] = useState(false);
  const location = useLocation();
  const isDark = !(isScrolled || isHovered);
  const textColor = isDark ? "text-white" : "text-black";
  const hoverColor = "hover:text-black";

  const profileRef = useRef(null);

  const {
    setShowSearch,
    navigate,
    getCartCount,
    token,
    setToken,
    setCartItems,
    setWishlist,
  } = useContext(shopContext);

  const logout = () => {
    navigate("/login");
    localStorage.removeItem("token");
    setToken("");
    setCartItems({});
    setWishlist([]);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowUserDropdown(false);
      }
    };
    if (showUserDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showUserDropdown]);

  useEffect(() => {
    if (location.pathname === "/") {
      const handleScroll = () => {
        setIsScrolled(window.scrollY > 20);
      };

      window.addEventListener("scroll", handleScroll);
      return () => window.removeEventListener("scroll", handleScroll);
    } else {
      setIsScrolled(true);
    }
  }, [location]);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`fixed top-0 left-0 z-50 w-full  flex items-center justify-between mt-0 py-5 font-medium px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] text-grey-700 transition-all  ${
        isScrolled ? "bg-white text-black shadow-md" : "bg-transparent"
      } ${isHovered ? "bg-white text-black shadow-md" : ""} `}
    >
      <Link to="/">
        <img
          src={isScrolled || isHovered ? assets.logo_dark : assets.logo_light}
          className="w-20 sm:w-36"
          alt="Aesthesia Logo"
        />
      </Link>

      <ul className="hidden sm:flex gap-5 text-sm">
        <NavLink
          to="/"
          className={`${textColor} ${hoverColor} ${
            isHovered || isScrolled ? "filter" : ""
          }`}
        >
          <p>Home</p>
        </NavLink>
        <NavLink
          to="/collection"
          className={`${textColor} ${hoverColor} ${
            isHovered || isScrolled ? "filter" : ""
          }`}
        >
          <p>Collections</p>
        </NavLink>
        <NavLink
          to="/about"
          className={`${textColor} ${hoverColor} ${
            isHovered || isScrolled ? "filter" : ""
          }`}
        >
          <p>About</p>
        </NavLink>
        <NavLink
          to="/contact"
          className={`${textColor} ${hoverColor} ${
            isHovered || isScrolled ? "filter" : ""
          }`}
        >
          <p>Contact</p>
        </NavLink>
      </ul>

      <div className={`flex items-center gap-6 text-[1.2rem] ${textColor}`}>
        <div
          onClick={() => {
            setShowSearch(true);
            navigate("/collection");
          }}
          className={`cursor-pointer ${hoverColor}`}
        >
          <MdOutlineSearch />
        </div>

        <div className="group relative" ref={profileRef}>
          <div
            onClick={() => {
              if (!token) {
                navigate("/login");
              } else {
                setShowUserDropdown((prev) => !prev);
              }
            }}
            tabIndex={0}
            className={`cursor-pointer ${hoverColor} relative outline-none`}
          >
            <CgProfile />
            {token && showUserDropdown && (
              <div className="absolute dropdown-menu right-0 pt-4 z-50">
                <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 rounded shadow">
                  <p className="cursor-pointer hover:text-black">My Profile</p>
                  <p
                    onClick={() => {
                      navigate("/orders");
                      setShowUserDropdown(false);
                    }}
                    className="cursor-pointer hover:text-black"
                  >
                    Orders
                  </p>
                  <p
                    onClick={() => {
                      logout();
                      setShowUserDropdown(false);
                    }}
                    className="cursor-pointer hover:text-black"
                  >
                    Logout
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="cursor-pointer hover:text-black hidden sm:block">
          <Link to="/wishlist">
            <FaRegHeart />
          </Link>
        </div>

        <div className="cursor-pointer hover:text-black relative">
          <Link to="/cart">
            <MdOutlineShoppingCart />
            <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-red-500 text-white aspect-square rounded-full text-[8px] ">
              {getCartCount()}
            </p>
          </Link>
        </div>

        <div
          onClick={() => setIsVisible(true)}
          className="cursor-pointer hover:text-black sm:hidden"
        >
          {isVisible ? (
            <div className="z-40">
              <MdOutlineClose />
            </div>
          ) : (
            <RiMenuFoldLine />
          )}
        </div>
      </div>

      <div
        className={`absolute top-0 right-0 bottom-0 h-screen overflow-hidden text-gray-700 bg-white transition-all ${
          isVisible ? "w-full" : "w-0"
        } `}
      >
        <div className="flex flex-col">
          <div
            onClick={() => setIsVisible(false)}
            className="flex items-center gap-4 p-3 cursor-pointer"
          >
            <img src={assets.dropdown_icon} alt="" className="h-4 rotate-180" />
            <p>Back</p>
          </div>
          <NavLink
            onClick={() => setIsVisible(false)}
            className="py-2 pl-6"
            to="/"
          >
            HOME
          </NavLink>
          <NavLink
            onClick={() => setIsVisible(false)}
            className="py-2 pl-6"
            to="/collection"
          >
            COLLECTION
          </NavLink>
          <NavLink
            onClick={() => setIsVisible(false)}
            className="py-2 pl-6"
            to="/about"
          >
            ABOUT
          </NavLink>
          <NavLink
            onClick={() => setIsVisible(false)}
            className="py-2 pl-6"
            to="/contact"
          >
            CONTACT
          </NavLink>
          <NavLink
            onClick={() => setIsVisible(false)}
            className="py-2 pl-6"
            to="/wishlist"
          >
            WISHLIST
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
