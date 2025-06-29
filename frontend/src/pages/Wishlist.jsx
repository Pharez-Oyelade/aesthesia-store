import React, { useContext } from "react";
import { shopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import { IoMdHeartDislike } from "react-icons/io";
import axios from "axios";

const Wishlist = () => {
  const {
    token,
    backendUrl,
    toast,
    wishlist,
    setWishlist,
    products,
    currency,
  } = useContext(shopContext);

  const handleRemove = async (id) => {
    setWishlist((prev) => prev.filter((pid) => pid !== id));
    // If user is logged in, update backend
    if (token) {
      try {
        const response = await axios.post(
          backendUrl + "/api/wishlist/add", // This toggles wishlist in your backend
          { itemId: id },
          { headers: { token } }
        );
        if (response.data.success && response.data.wishData) {
          setWishlist(response.data.wishData);
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to update wishlist");
      }
    }
  };

  if (!wishlist.length) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your wishlist is empty</h2>
        <Link to="/collection" className="text-red-600 underline">
          Browse products
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Your Wishlist</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {wishlist.map((id) => {
          const product = products.find((p) => p._id === id);
          if (!product) return null;
          return (
            <div
              key={id}
              className="bg-white rounded-xl shadow p-4 flex flex-col items-center relative"
            >
              {/* Bestseller Tag */}
              {product.bestseller && (
                <span className="absolute left-2 top-2 z-10 bg-yellow-400 text-xs font-bold px-3 py-1 rounded-full shadow text-gray-900">
                  Bestseller
                </span>
              )}
              <img
                src={product.image[0]}
                alt={product.name}
                className="w-32 h-32 object-cover rounded mb-2"
              />
              <h3 className="font-medium text-lg mb-1">{product.name}</h3>
              <p className="text-md text-gray-500 flex items-center gap-1 mb-2">
                {currency}
                {product.price}
              </p>
              <div className="flex gap-2">
                <Link
                  to={`/product/${id}`}
                  className="text-blue-600 underline text-sm"
                >
                  View
                </Link>
                <button
                  onClick={() => handleRemove(id)}
                  className="text-red-600 flex items-center gap-1 text-sm hover:underline"
                  title="Remove from wishlist"
                >
                  <span>Remove</span>
                  <IoMdHeartDislike />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Wishlist;
