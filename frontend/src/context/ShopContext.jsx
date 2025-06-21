// import React, { createContext, useState } from "react";
// import { TbCurrencyNaira } from "react-icons/tb";
// import { products } from "../assets/assets";
// import { useNavigate } from "react-router-dom";
// import { toast } from "react-toastify";

// export const shopContext = createContext();

// const ShopContextProvider = (props) => {
//   const currency = <TbCurrencyNaira />;
//   const delivery_fee = 700;
//   const [search, setSearch] = useState("");
//   const [showSearch, setShowSearch] = useState(false);
//   const [cartItems, setCartItems] = useState({});
//   const [wishItems, setWishItems] = useState({});
//   const navigate = useNavigate();

//   const addToCart = async (itemId, size) => {
//     if (!size) {
//       toast.error("select a size");

//       return;
//     } else {
//       toast.success("Item successfully added to cart");
//       console.log(cartItems);
//     }

//     // let cartData = structuredClone(cartItems);
//     let cartData = JSON.parse(JSON.stringify(cartItems));

//     if (cartData[itemId]) {
//       if (cartData[itemId][size]) {
//         cartData[itemId][size] += 1;
//       } else {
//         cartData[itemId][size] = 1;
//       }
//     } else {
//       cartData[itemId] = {};
//       cartData[itemId][size] = 1;
//     }
//     setCartItems(cartData);
//   };

//   const getCartCount = () => {
//     let totalCount = 0;
//     for (const items in cartItems) {
//       for (const item in cartItems[items]) {
//         try {
//           if (cartItems[items][item] > 0) {
//             totalCount += cartItems[items][item];
//           }
//         } catch (error) {}
//       }
//     }
//     return totalCount;
//   };

//   const updateQuantity = async (itemId, size, quantity) => {
//     let cartData = structuredClone(cartItems);

//     cartData[itemId][size] = quantity;

//     setCartItems(cartData);
//   };

//   const addToWishlist = async (itemId) => {
//     toast.success("item added to wishlist");

//     let wishlistData = structuredClone(wishItems);

//     if (wishlistData[itemId]) {
//       wishlistData[itemId] += 1;
//     } else {
//       wishlistData[itemId] = {};
//       wishlistData[itemId] = 1;
//     }
//     setWishItems(wishlistData);
//   };

//   const value = {
//     products,
//     currency,
//     delivery_fee,
//     search,
//     setSearch,
//     showSearch,
//     setShowSearch,
//     addToCart,
//     getCartCount,
//     updateQuantity,
//     addToWishlist,
//     navigate,
//   };

//   return (
//     <shopContext.Provider value={value}>{props.children}</shopContext.Provider>
//   );
// };

// export default ShopContextProvider;

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
  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();

  const addToCart = async (itemId, size) => {
    if (!size) {
      toast.error("Select Product Size");
      return;
    } else {
      toast.success("Item successfully added to cart!");
    }

    let cartData = structuredClone(cartItems);

    if (cartData[itemId]) {
      if (cartData[itemId][size]) {
        cartData[itemId][size] += 1;
      } else {
        cartData[itemId][size] = 1;
      }
    } else {
      cartData[itemId] = {};
      cartData[itemId][size] = 1;
    }
    setCartItems(cartData);
  };

  const getCartCount = () => {
    let totalCount = 0;
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalCount += cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalCount;
  };

  const updateQuantity = async (itemId, size, quantity) => {
    let cartData = structuredClone(cartItems);

    cartData[itemId][size] = quantity;

    setCartItems(cartData);
  };

  const getCartAmount = () => {
    let totalAmount = 0;
    for (const items in cartItems) {
      let itemInfo = products.find((product) => product._id === items);
      for (const item in cartItems[items]) {
        try {
          if (cartItems[items][item] > 0) {
            totalAmount += itemInfo.price * cartItems[items][item];
          }
        } catch (error) {}
      }
    }
    return totalAmount;
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
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate,
  };

  return (
    <shopContext.Provider value={value}>{props.children}</shopContext.Provider>
  );
};

export default ShopContextProvider;
