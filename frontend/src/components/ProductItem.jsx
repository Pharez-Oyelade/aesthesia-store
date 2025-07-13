import React, { useContext, useEffect, useState } from "react";
import { shopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { IoMdHeart } from "react-icons/io";

const ProductItem = ({
  id,
  image,
  name,
  price,
  bestseller,
  onSale,
  salePrice,
  preorder,
  soldOut,
}) => {
  const { currency, addToWishlist, wishlist, formatPrice, convertPrice } =
    useContext(shopContext);

  const [isHovered, setIsHovered] = useState(false);
  const [showImage, setShowImage] = useState(image[0]);

  const handleWishlist = (e) => {
    e.preventDefault();
    addToWishlist(id);
  };

  const isWishlisted = wishlist && wishlist.includes(id);

  useEffect(() => {
    setShowImage(image[0]);
  }, [image]);

  return (
    <Link to={`/product/${id}`} className="text-gray-700 cursor-pointer">
      <div className="relative group overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 rounded-3xl">
        {/* Bestseller Tag */}
        {bestseller && (
          <span className="absolute left-2 top-2 z-10 bg-yellow-400 text-xs font-bold px-3 py-1 rounded-full shadow text-gray-900">
            Bestseller
          </span>
        )}
        {preorder && (
          <span
            className={`absolute left-2 z-10 bg-yellow-400 text-xs font-bold px-3 py-1 rounded-full shadow text-gray-900 ${
              bestseller ? "top-10" : "top-2"
            }`}
          >
            Preorder
          </span>
        )}
        {onSale && (
          <span
            className={`absolute left-2 z-10 bg-red-500 text-xs font-bold px-3 py-1 rounded-full shadow text-white ${
              bestseller && preorder
                ? "top-18"
                : bestseller || preorder
                ? "top-10"
                : "top-2"
            } `}
          >
            Sale
          </span>
        )}
        {soldOut && (
          <span
            className={`absolute left-2 z-10 bg-red-500 text-xs font-bold px-3 py-1 rounded-full shadow text-white ${
              bestseller && preorder
                ? "top-18"
                : bestseller || preorder
                ? "top-10"
                : "top-2"
            } `}
          >
            Sold Out
          </span>
        )}

        <img
          onMouseEnter={() => {
            setIsHovered(true);
            if (image[1]) setShowImage(image[1]);
          }}
          onMouseLeave={() => {
            setIsHovered(false);
            setShowImage(image[0]);
          }}
          src={showImage}
          alt=""
          className={`${
            image[1] ? "" : "hover:scale-115 transition ease-in-out"
          }`}
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
      {/* <p className="text-sm font-medium flex items-center ">
        {currency}
        {price}
      </p> */}
      <p className="text-sm font-medium flex items-center ">
        {onSale ? (
          <>
            <span className="flex items-center line-through text-gray-400 mr-2">
              {currency}
              {convertPrice(price)}
            </span>
            <span className="flex items-center   text-red-600">
              {currency}
              {convertPrice(salePrice)}
            </span>
          </>
        ) : (
          <>
            {currency}
            {convertPrice(price)}
          </>
        )}
      </p>
    </Link>
  );
};

export default ProductItem;
