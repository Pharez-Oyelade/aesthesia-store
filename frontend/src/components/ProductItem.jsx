import React, { useContext } from "react";
import { shopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { IoMdHeart } from "react-icons/io";

const ProductItem = ({ id, image, name, price }) => {
  const { currency, addToWishlist, wishlist } = useContext(shopContext);

  const handleWishlist = (e) => {
    e.preventDefault(); // Prevent navigation when clicking heart
    addToWishlist(id);
  };

  const isWishlisted = wishlist && wishlist.includes(id);

  return (
    <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer">
      <div className="relative group overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 rounded-3xl">
        <img
          src={image[0]}
          alt=""
          className="hover:scale-115 transition ease-in-out"
        />
        <div className="absolute right-2 top-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition">
          <button
            onClick={handleWishlist}
            className={`text-2xl px-3 py-3 rounded-full cursor-pointer ${
              isWishlisted ? "text-red-600" : "text-white"
            }`}
            title={isWishlisted ? "In Wishlist" : "Add to Wishlist"}
          >
            <IoMdHeart />
          </button>
        </div>
      </div>
      <p className="pt-3 pb-1 text-sm">{name}</p>
      <p className="text-sm font-medium flex items-center ">
        {currency}
        {price}
      </p>
    </Link>
  );
};

export default ProductItem;
