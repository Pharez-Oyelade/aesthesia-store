// import { createContext, useEffect, useState } from "react";
// import { TbCurrencyNaira } from "react-icons/tb";
// // import { products } from "../assets/assets";
// import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export const shopContext = createContext();

// const ShopContextProvider = (props) => {
//   const currency = <TbCurrencyNaira />;
//   const delivery_fee = 100;
//   const backendUrl = import.meta.env.VITE_BACKEND_URL;
//   const [search, setSearch] = useState("");
//   const [showSearch, setShowSearch] = useState(false);
//   const [cartItems, setCartItems] = useState({});
//   const [wishlist, setWishlist] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [token, setToken] = useState("");
//   const navigate = useNavigate();

//   // Helper to create a unique key for measurements
//   const getMeasurementsKey = (measurements) => {
//     return JSON.stringify(measurements || {});
//   };

//   const addToCart = async (itemId, size, measurements, quantity = 1) => {
//     if (!size) {
//       toast.error("Select Product Size");
//       return;
//     }
//     if (!measurements || Object.values(measurements).some((v) => !v)) {
//       toast.error("Please fill all measurements");
//       return;
//     }
//     if (quantity < 1) {
//       toast.error("Quantity must be at least 1");
//       return;
//     }
//     toast.success("Item successfully added to cart!");

//     setCartItems((prevCart) => {
//       let cartData = structuredClone(prevCart);
//       const mKey = getMeasurementsKey(measurements);
//       if (!cartData[itemId]) cartData[itemId] = {};
//       if (!cartData[itemId][size]) cartData[itemId][size] = {};
//       if (cartData[itemId][size][mKey]) {
//         cartData[itemId][size][mKey] += quantity;
//       } else {
//         cartData[itemId][size][mKey] = quantity;
//       }
//       return cartData;
//     });

//     if (token) {
//       try {
//         await axios.post(
//           backendUrl + "/api/cart/add",
//           { itemId, size, measurements, quantity },
//           {
//             headers: { token },
//           }
//         );
//       } catch (error) {
//         console.log(error);
//         toast.error(error.message);
//       }
//     }
//   };

//   const getCartCount = () => {
//     let totalCount = 0;
//     for (const items in cartItems) {
//       for (const size in cartItems[items]) {
//         for (const mKey in cartItems[items][size]) {
//           try {
//             if (cartItems[items][size][mKey] > 0) {
//               totalCount += cartItems[items][size][mKey];
//             }
//           } catch (error) {}
//         }
//       }
//     }
//     return totalCount;
//   };

//   const updateQuantity = async (itemId, size, measurements, quantity) => {
//     setCartItems((prevCart) => {
//       let cartData = structuredClone(prevCart);
//       const mKey = getMeasurementsKey(measurements);
//       if (
//         cartData[itemId] &&
//         cartData[itemId][size] &&
//         cartData[itemId][size][mKey] !== undefined
//       ) {
//         cartData[itemId][size][mKey] = quantity;
//         // Remove if quantity is 0
//         if (quantity === 0) {
//           delete cartData[itemId][size][mKey];
//           if (Object.keys(cartData[itemId][size]).length === 0)
//             delete cartData[itemId][size];
//           if (Object.keys(cartData[itemId]).length === 0)
//             delete cartData[itemId];
//         }
//       }
//       return cartData;
//     });

//     if (token) {
//       try {
//         await axios.post(
//           backendUrl + "/api/cart/update",
//           { itemId, size, measurements, quantity },
//           {
//             headers: { token },
//           }
//         );
//       } catch (error) {
//         console.log(error);
//         toast.error(error.message);
//       }
//     }
//   };

//   const getCartAmount = () => {
//     let totalAmount = 0;
//     for (const items in cartItems) {
//       let itemInfo = products.find((product) => product._id === items);
//       for (const size in cartItems[items]) {
//         for (const mKey in cartItems[items][size]) {
//           try {
//             if (cartItems[items][size][mKey] > 0) {
//               totalAmount += itemInfo.price * cartItems[items][size][mKey];
//             }
//           } catch (error) {}
//         }
//       }
//     }
//     return totalAmount;
//   };

//   const addToWishlist = async (productId) => {
//     if (wishlist.includes(productId)) {
//       toast.info("Product already in wishlist");
//       return;
//     }
//     setWishlist((prev) => [...prev, productId]);
//     toast.success("Added to wishlist");

//     if (token) {
//       try {
//         const response = await axios.post(
//           backendUrl + "/api/wishlist/add",
//           { itemId: productId },
//           { headers: { token } }
//         );
//         if (response.data.success && response.data.wishData) {
//           setWishlist(response.data.wishData);
//         }
//       } catch (error) {
//         console.log(error);
//         toast.error(error.message);
//       }
//     }
//   };

//   const getProductsData = async () => {
//     try {
//       const response = await axios.get(backendUrl + "/api/product/list");
//       if (response.data.success) {
//         setProducts(response.data.products);
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   };

//   const getUserCart = async (token) => {
//     try {
//       const response = await axios.post(
//         backendUrl + "/api/cart/get",
//         {},
//         { headers: { token } }
//       );
//       if (response.data.success) {
//         setCartItems(response.data.cartData || {});
//       } else {
//         toast.error(response.data.message);
//       }
//     } catch (error) {
//       console.log(error);
//       toast.error(error.message);
//     }
//   };

//   const getUserWishlist = async (token) => {
//     try {
//       const response = await axios.post(
//         backendUrl + "/api/wishlist/get",
//         {},
//         { headers: { token } }
//       );
//       if (response.data.success) {
//         setWishlist(response.data.wishData || []);
//       }
//     } catch (error) {
//       console.log(error);
//     }
//   };

//   useEffect(() => {
//     getProductsData();
//   }, []);

//   useEffect(() => {
//     if (!token && localStorage.getItem("token")) {
//       setToken(localStorage.getItem("token"));
//       getUserCart(localStorage.getItem("token"));
//       getUserWishlist(localStorage.getItem("token"));
//     }
//   }, []);

//   const value = {
//     products,
//     currency,
//     delivery_fee,
//     search,
//     setSearch,
//     showSearch,
//     setShowSearch,
//     cartItems,
//     setCartItems,
//     addToCart,
//     getCartCount,
//     updateQuantity,
//     getCartAmount,
//     wishlist,
//     setWishlist,
//     addToWishlist,
//     navigate,
//     backendUrl,
//     token,
//     setToken,
//     getUserCart,
//     getUserWishlist,
//   };

//   return (
//     <shopContext.Provider value={value}>{props.children}</shopContext.Provider>
//   );
// };

// export default ShopContextProvider;

import { createContext, useEffect, useState } from "react";
import { TbCurrencyNaira } from "react-icons/tb";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const shopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = <TbCurrencyNaira />;
  const delivery_fee = 100;
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  // Helper to create a unique key for measurements
  const getMeasurementsKey = (measurements) => {
    return JSON.stringify(measurements || {});
  };

  const addToCart = async (itemId, size, measurements, quantity = 1) => {
    // if (!size) {
    //   toast.error("Select Product Size");
    //   return;
    // }
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

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size, measurements, quantity },
          {
            headers: { token },
          }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
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

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/update",
          { itemId, size, measurements, quantity },
          {
            headers: { token },
          }
        );
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
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

  const addToWishlist = async (productId) => {
    if (wishlist.includes(productId)) {
      toast.info("Product already in wishlist");
      return;
    }
    setWishlist((prev) => [...prev, productId]);
    toast.success("Added to wishlist");

    if (token) {
      try {
        const response = await axios.post(
          backendUrl + "/api/wishlist/add",
          { itemId: productId },
          { headers: { token } }
        );
        if (response.data.success && response.data.wishData) {
          setWishlist(response.data.wishData);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
    }
  };

  const getProductsData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setProducts(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserCart = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/cart/get",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems(response.data.cartData || {});
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const getUserWishlist = async (token) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/wishlist/get",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setWishlist(response.data.wishData || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getProductsData();
  }, []);

  useEffect(() => {
    if (!token && localStorage.getItem("token")) {
      setToken(localStorage.getItem("token"));
      getUserCart(localStorage.getItem("token"));
      getUserWishlist(localStorage.getItem("token"));
    }
  }, []);

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
    backendUrl,
    token,
    setToken,
    getUserCart,
    getUserWishlist,
  };

  return (
    <shopContext.Provider value={value}>{props.children}</shopContext.Provider>
  );
};

export default ShopContextProvider;
