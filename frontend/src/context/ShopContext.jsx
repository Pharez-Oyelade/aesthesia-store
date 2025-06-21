import { createContext, useEffect, useState } from "react";
import { TbCurrencyNaira } from "react-icons/tb";
import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const shopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = <TbCurrencyNaira />;
  const delivery_fee = 100;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  // cartItems: { [itemId]: { [size]: { [measurementsKey]: quantity } } }
  const [cartItems, setCartItems] = useState({});
  const [wishlist, setWishlist] = useState([]); // Array of product IDs
  const navigate = useNavigate();

  // Helper to create a unique key for measurements
  const getMeasurementsKey = (measurements) => {
    return JSON.stringify(measurements || {});
  };

  const addToCart = async (itemId, size, measurements, quantity = 1) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    }
    if (!measurements || Object.values(measurements).some((v) => !v)) {
      toast.error("Please fill all measurements");
      return;
    }
    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }
    toast.success("Item successfully added to cart!");

    setCartItems((prevCart) => {
      let cartData = structuredClone(prevCart);
      const mKey = getMeasurementsKey(measurements);
      if (!cartData[itemId]) cartData[itemId] = {};
      if (!cartData[itemId][size]) cartData[itemId][size] = {};
      if (cartData[itemId][size][mKey]) {
        cartData[itemId][size][mKey] += quantity;
      } else {
        cartData[itemId][size][mKey] = quantity;
      }
      return cartData;
    });
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const size in cartItems[items]) {
        for (const mKey in cartItems[items][size]) {
          try {
            if (cartItems[items][size][mKey] > 0) {
              totalCount += cartItems[items][size][mKey];
            }
          } catch (error) {}
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, measurements, quantity) => {
    setCartItems((prevCart) => {
      let cartData = structuredClone(prevCart);
      const mKey = getMeasurementsKey(measurements);
      if (
        cartData[itemId] &&
        cartData[itemId][size] &&
        cartData[itemId][size][mKey] !== undefined
      ) {
        cartData[itemId][size][mKey] = quantity;
        // Remove if quantity is 0
        if (quantity === 0) {
          delete cartData[itemId][size][mKey];
          if (Object.keys(cartData[itemId][size]).length === 0)
            delete cartData[itemId][size];
          if (Object.keys(cartData[itemId]).length === 0)
            delete cartData[itemId];
        }
      }
      return cartData;
    });
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const size in cartItems[items]) {
        for (const mKey in cartItems[items][size]) {
          try {
            if (cartItems[items][size][mKey] > 0) {
              totalAmount += itemInfo.price * cartItems[items][size][mKey];
            }
          } catch (error) {}
        }
      }
    }
    return totalAmount;
  };

  const addToWishlist = (productId) => {
    if (wishlist.includes(productId)) {
      toast.info("Product already in wishlist");
      return;
    }
    setWishlist((prev) => [...prev, productId]);
    toast.success("Added to wishlist");
  };

  const value = {
    products,
    currency,
    delivery_fee,
    search,
    setSearch,
    showSearch,
    setShowSearch,
    cartItems,
    setCartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    wishlist,
    setWishlist,
    addToWishlist,
    navigate,
  };

  return (
    <shopContext.Provider value={value}>{props.children}</shopContext.Provider>
  );
};

export default ShopContextProvider;
