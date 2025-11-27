import { createContext, useEffect, useState } from "react";
import { TbCurrencyNaira } from "react-icons/tb";
import { toast } from "react-toastify";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../utils/axiosConfig";
import authService from "../services/authService";

import {
  calculateCartWeight,
  calculateInternationalShipping,
  isInternationalOrder,
} from "../services/shippingService";

export const shopContext = createContext();

const currencySymbols = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
};

const supportedCurrencies = ["NGN", "USD", "GBP", "EUR"];

const deliveryFees = {
  "Lagos Island 1": 5000,
  "Lagos Island 2": 7000,
  "Lagos Island 3": 8000,
  "Lagos Mainland 1": 4000,
  "Lagos Mainland 2": 5000,
  "Lagos Mainland 3": 6000,
};

const localDelivery = [
  {
    location: "Oyo",
    price: 15000,
    areas: ["Ibadan"],
  },
  {
    location: "Northern States",
    price: 20000,
    areas: ["Others(Enter state manually)"],
  },
  {
    location: "Eastern States",
    price: 22000,
    areas: ["Others(Enter state manually)"],
  },
  {
    location: "Lagos Island 1",
    price: 5000,
    areas: [
      "Oniru",
      "Oriental",
      "Freedom Way",
      "Lekki Phase 1",
      "Banana Island",
      "VI",
      "Ikoyi",
      "Obalende",
      "Lagos Island",
    ],
  },
  {
    location: "Lagos Island 2",
    price: 7000,
    areas: [
      "Chevron",
      "Agungi",
      "Jakande",
      "Ikate",
      "Elegushi",
      "Osapa London",
      "Ogombo",
      "Abraham Adesanya",
      "LBS",
      "Sangotedo",
      "Ajah",
    ],
  },
  {
    location: "Lagos Mainland 1",
    price: 4000,
    areas: [
      "Gbagada",
      "Palmgroove",
      "Onipan",
      "Anthony",
      "Maryland",
      "Ikeja",
      "Oshodi",
      "Ojota",
      "Alapere",
      "Ketu",
      "Bariga",
      "Magodo",
    ],
  },
  {
    location: "Lagos Mainland 2",
    price: 5000,
    areas: [
      "Yaba",
      "Surulere",
      "Costain",
      "Mushin",
      "Ilupeju",
      "Omole Phase 1",
      "Omole Phase 2",
      "Ebute meta",
      "Shomolu",
      "Isolo",
      "Ajao Estate",
    ],
  },
  {
    location: "Lagos Island 3",
    price: 8000,
    areas: ["Epe", "Lakowe", "Awoyaya & closest axis"],
  },
  {
    location: "Lagos Mainland 3",
    price: 5000,
    areas: [
      "Berger",
      "Iju",
      "Ishaga",
      "Ikorodu",
      "Ojo",
      "Ayobo",
      "Alaba",
      "Agbado",
      "satellite",
      "trade fair",
      "UBA",
      "Ogba",
      "Festac",
      "Ejigbo",
      "Igando",
      "Ikotun",
      "Ipaja",
      "Agbulegba",
      "Iju Ishaga & surrounding",
      "Egbeda",
    ],
  },
];

const locationToState = {
  "Lagos Mainland 1": "Lagos",
  "Lagos Mainland 2": "Lagos",
  "Lagos Mainland 3": "Lagos",
  "Lagos Island 1": "Lagos",
  "Lagos Island 2": "Lagos",
  "Lagos Island 3": "Lagos",
  "Northern States": "North",
  "Eastern States": "East",
  Oyo: "Oyo",
  Other: "",
};

// Caching constants
const RATES_CACHE_KEY = "exchangeRates";
const RATES_CACHE_TIME_KEY = "exchangeRatesTimestamp";
const CACHE_DURATION_MS = 30 * 24 * 60 * 60 * 1000; // 30 days

// const formatNumberWithCommas = (number) => {
//   return number.toLocaleString("en-NG");
// };

const formatPrice = (amount) => {
  return amount.toLocaleString("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
};

const ShopContextProvider = (props) => {
  const currency = <TbCurrencyNaira />;
  // const delivery_fee = 100;
  // const VAT_RATE = 0.075; //7.5%
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [cartItems, setCartItems] = useState({});
  const [wishlist, setWishlist] = useState([]);
  const [products, setProducts] = useState([]);
  const [collection, setCollection] = useState([]);
  const [token, setToken] = useState("");
  const [userData, setUserData] = useState({ name: "", email: "" });
  const navigate = useNavigate();
  // internation order states
  const [selectedCountry, setSelectedCountry] = useState("");
  const [isInternational, setIsInternational] = useState(false);

  const [selectedLocation, setSelectedLocation] = useState("");
  const [delivery_fee, setDeliveryFee] = useState(0);

  const [userOrders, setUserOrders] = useState([]);
  const prevOrderStatus = useRef({});

  const logout = async () => {
    try {
      // Clear tokens first
      authService.clearTokens();

      // Clear state
      setToken("");
      setUserData({ name: "", email: "" });
      setCartItems({});
      setWishlist([]);

      // Navigate to login
      navigate("/login");

      // Optionally call logout API in background (don't await)
      authService
        .logout()
        .catch((err) => console.log("Background logout error:", err));
    } catch (error) {
      console.log("Logout error:", error);
      // Even if there's an error, still clear local state
      authService.clearTokens();
      setToken("");
      navigate("/login");
    }
  };

  // const [sections, setSections] = useState([]);

  // const getSections = async () => {
  //   try {
  //     const response = await axios.get(backendUrl + "/api/section/list");
  //     if (response.data.success) {
  //       setSections(response.data.sections.map((s) => s.name));
  //     }
  //   } catch (err) {}
  // };

  // const getVAT = () => {
  //   return getCartAmount() * VAT_RATE;
  // };

  // Currency state
  const [currencyCode, setCurrencyCode] = useState("NGN");
  const [currencyRates, setCurrencyRates] = useState({ NGN: 1 });

  // Fetch live rates on mount and when currency changes
  useEffect(() => {
    const loadRates = async () => {
      // 1. Try to load from cache
      const cachedRates = localStorage.getItem(RATES_CACHE_KEY);
      const cachedTime = localStorage.getItem(RATES_CACHE_TIME_KEY);
      const now = Date.now();

      if (
        cachedRates &&
        cachedTime &&
        now - Number(cachedTime) < CACHE_DURATION_MS
      ) {
        setCurrencyRates(JSON.parse(cachedRates));
        return;
      }

      // 2. Fetch from API if not cached or cache expired
      try {
        const symbols = supportedCurrencies.join(",");
        const res = await fetch(
          // `http://data.fixer.io/api/latest?access_key=8c1642632da8d81c67684ebeaec5dc9d&symbols=${symbols}`
          `https://api.currencyapi.com/v3/latest?apikey=cur_live_dTEc4h83P8JtkzIQhFlxOUfTVJvsClgaUNhqQx0e&symbols=${symbols}`
        );
        const data = await res.json();
        if (data && data.data) {
          const rates = { NGN: 1 };
          for (const [code, obj] of Object.entries(data.data)) {
            rates[code] = obj.value;
          }
          setCurrencyRates(rates);
          // Save to cache
          localStorage.setItem(RATES_CACHE_KEY, JSON.stringify(rates));
          localStorage.setItem(RATES_CACHE_TIME_KEY, now.toString());
        }
      } catch (err) {
        toast.error("Failed to fetch currency rates. Using default rates.");
        setCurrencyRates({ NGN: 1, USD: 0.0011, GBP: 0.00087, EUR: 0.001 });
      }
    };
    loadRates();
  }, [currencyCode]);

  // Helper to create a unique key for measurements
  const getMeasurementsKey = (measurements) => {
    return JSON.stringify(measurements || {});
  };

  const convertPrice = (amount) => {
    if (currencyCode === "NGN") {
      return Number(amount).toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    const rates = currencyRates;
    if (!rates || !rates.NGN || !rates[currencyCode])
      return Number(amount).toLocaleString("en-NG", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    // Convert NGN -> EUR, then EUR -> target
    const amountInEUR = Number(amount) / rates.NGN;
    const converted = amountInEUR * rates[currencyCode];
    return converted.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  };

  const addToCart = async (itemId, size, color, measurements, quantity = 1) => {
    if (quantity < 1) {
      toast.error("Quantity must be at least 1");
      return;
    }
    toast.success("Item successfully added to cart!");

    setCartItems((prevCart) => {
      let cartData = structuredClone(prevCart);
      const mKey = getMeasurementsKey(measurements);
      const colorKey = color || "no-color";
      if (!cartData[itemId]) cartData[itemId] = {};
      if (!cartData[itemId][size]) cartData[itemId][size] = {};
      if (!cartData[itemId][size][colorKey])
        cartData[itemId][size][colorKey] = {};
      if (cartData[itemId][size][colorKey][mKey]) {
        cartData[itemId][size][colorKey][mKey] += quantity;
      } else {
        cartData[itemId][size][colorKey][mKey] = quantity;
      }
      return cartData;
    });

    if (token) {
      try {
        await axios.post(
          backendUrl + "/api/cart/add",
          { itemId, size, color, measurements, quantity },
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
        for (const colorKey in cartItems[items][size]) {
          for (const mKey in cartItems[items][size][colorKey]) {
            try {
              if (cartItems[items][size][colorKey][mKey] > 0) {
                totalCount += cartItems[items][size][colorKey][mKey];
              }
            } catch (error) {}
          }
        }
      }
    }
    return totalCount;
  };

  const updateQuantity = async (
    itemId,
    size,
    color,
    measurements,
    quantity
  ) => {
    setCartItems((prevCart) => {
      let cartData = structuredClone(prevCart);
      const mKey = getMeasurementsKey(measurements);
      const colorKey = color || "no-color";
      if (
        cartData[itemId] &&
        cartData[itemId][size] &&
        cartData[itemId][size][colorKey] &&
        cartData[itemId][size][colorKey][mKey] !== undefined
      ) {
        cartData[itemId][size][colorKey][mKey] = quantity;
        // Remove if quantity is 0
        if (quantity === 0) {
          delete cartData[itemId][size][colorKey][mKey];
          if (Object.keys(cartData[itemId][size][colorKey]).length === 0)
            delete cartData[itemId][size][colorKey];
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
          { itemId, size, color, measurements, quantity },
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
        for (const colorKey in cartItems[items][size]) {
          for (const mKey in cartItems[items][size][colorKey]) {
            try {
              if (cartItems[items][size][colorKey][mKey] > 0) {
                totalAmount += itemInfo.onSale
                  ? itemInfo.salePrice * cartItems[items][size][colorKey][mKey]
                  : itemInfo.price * cartItems[items][size][colorKey][mKey];
              }
            } catch (error) {}
          }
        }
      }
    }
    return totalAmount;
  };

  // CArt weight
  const getCartWeight = () => {
    return calculateCartWeight(cartItems, products);
  };

  const getShippingCost = () => {
    if (isInternationalOrder(selectedCountry)) {
      const weight = getCartWeight();
      return calculateInternationalShipping(selectedCountry, weight);
    }
    return delivery_fee;
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

  const getCollectionData = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/section/list");
      if (response.data.success) {
        // backend may return the sections under different keys depending on API version
        const sectionsData =
          response.data.categories ?? response.data.sections ?? [];
        // ensure we always set an array to avoid runtime errors in consumers
        setCollection(Array.isArray(sectionsData) ? sectionsData : []);
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
      const response = await api.post("/api/cart/get", {});
      if (response.data.success) {
        setCartItems(response.data.cartData || {});
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      if (error.response?.status !== 401) {
        toast.error(error.message);
      }
    }
  };

  const getUserWishlist = async (token) => {
    try {
      const response = await api.post("/api/wishlist/get", {});
      if (response.data.success) {
        setWishlist(response.data.wishData || []);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const getUserDetails = async (token) => {
    try {
      const response = await api.post("/api/user/details", {});
      if (response.data.success && response.data.user) {
        setUserData(response.data.user);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const subscribeToMailchimp = async (email, name = "") => {
    try {
      const response = await axios.post(
        backendUrl + "/api/mailchimp/subscribe",
        {
          email,
          name,
        }
      );
      if (response.status === 200) {
        toast.success(
          response.data.message || "Successfully subscribed to newsletter!"
        );
        return true;
      }
    } catch (error) {
      console.log("Mailchimp subscription error:", error);

      // Handle specific error cases
      if (error.response?.data?.message) {
        toast.info(error.response.data.message);
        return true; // Treat "Already subscribed" as success
      } else if (error.response?.data?.error) {
        // Check if it's the permanently deleted email error
        if (error.response.data.error.includes("previously unsubscribed")) {
          toast.error(
            "This email was previously unsubscribed. Please use a different email address or contact support.",
            { autoClose: 6000 }
          );
        } else {
          toast.error(error.response.data.error);
        }
      } else if (error.response?.status === 500) {
        toast.error(
          "Newsletter service is temporarily unavailable. Please try again later."
        );
      } else {
        toast.error("Failed to subscribe to newsletter. Please try again.");
      }
      return false;
    }
  };

  // const getLocalDeliveryFee = (area) => {
  //   const match = localDelivery.find((loc) => loc.areas.includes(area));
  //   return match ? match.price : 0;
  // };

  useEffect(() => {
    getCollectionData();
  }, [backendUrl]);

  // useEffect(() => {
  //   if (selectedLocation && deliveryFees[selectedLocation] !== undefined) {
  //     setDeliveryFee(localDelivery.price[selectedLocation]);
  //     setIsInternational(false);
  //   } else if (selectedCountry && isInternationalOrder(selectedCountry)) {
  //     setIsInternational(true);
  //   } else {
  //     setDeliveryFee(0);
  //     setIsInternational(false);
  //   }
  // }, [selectedLocation, selectedCountry]);

  useEffect(() => {
    if (selectedLocation) {
      // Try to match selectedLocation as an area first
      const matchByArea = localDelivery.find(
        (loc) =>
          Array.isArray(loc.areas) && loc.areas.includes(selectedLocation)
      );
      if (matchByArea) {
        setDeliveryFee(matchByArea.price);
        setIsInternational(false);
        return; // stop further checks
      }

      // If no area matched, allow selectedLocation to be the location/group name
      const matchByGroup = localDelivery.find(
        (loc) => loc.location === selectedLocation
      );
      if (matchByGroup) {
        setDeliveryFee(matchByGroup.price);
        setIsInternational(false);
        return;
      }
    }

    // If selected country is not Nigeria (international order)
    if (selectedCountry && isInternationalOrder(selectedCountry)) {
      setIsInternational(true);
      const cost = getShippingCost(selectedCountry);
      setDeliveryFee(cost || 0);
    } else {
      // Default reset if no valid location/country
      setDeliveryFee(0);
      setIsInternational(false);
    }
  }, [selectedLocation, selectedCountry, localDelivery]);

  useEffect(() => {
    getProductsData();
  }, []);

  // // Polling for order status changes
  // useEffect(() => {
  //   if (!token) return;

  //   const fetchOrdersAndNotify = async (showNotification = false) => {
  //     try {
  //       const response = await axios.post(
  //         backendUrl + "/api/order/userorders",
  //         {},
  //         { headers: { token } }
  //       );
  //       if (response.data.success) {
  //         let allOrdersItem = [];
  //         response.data.orders.forEach((order) => {
  //           order.items.forEach((item) => {
  //             item["status"] = order.status || "pending";
  //             item["orderId"] = order._id;
  //             allOrdersItem.push(item);
  //           });
  //         });

  //         // Notification logic
  //         if (showNotification) {
  //           allOrdersItem.forEach((item) => {
  //             const prevStatus = prevOrderStatus.current[item.orderId];
  //             if (prevStatus && prevStatus !== item.status) {
  //               toast.info(`Order for ${item.name} is now "${item.status}"`);
  //             }
  //           });
  //         }

  //         // Update previous status map
  //         prevOrderStatus.current = {};
  //         allOrdersItem.forEach((item) => {
  //           prevOrderStatus.current[item.orderId] = item.status;
  //         });

  //         setUserOrders(allOrdersItem);
  //       }
  //     } catch (error) {
  //       // handle error
  //     }
  //   };

  //   // Initial fetch (no notification)
  //   fetchOrdersAndNotify(false);

  //   // Polling interval
  //   const interval = setInterval(() => {
  //     fetchOrdersAndNotify(true);
  //   }, 30000); // 30 seconds

  //   return () => clearInterval(interval);
  // }, [token, backendUrl]);

  // useEffect(() => {
  //   if (!token && localStorage.getItem("token")) {
  //     const storedToken = localStorage.getItem("token");
  //     setToken(storedToken);
  //     getUserCart(storedToken);
  //     getUserWishlist(storedToken);
  //     getUserDetails(storedToken);
  //   }
  // }, []);

  useEffect(() => {
    const { token: storedToken } = authService.getTokens();

    if (storedToken && !authService.isTokenExpired(storedToken)) {
      setToken(storedToken);
      getUserCart(storedToken);
      getUserWishlist(storedToken);
      getUserDetails(storedToken);
    } else if (storedToken) {
      // Token is expired, try to refresh
      authService
        .refreshToken()
        .then((newToken) => {
          setToken(newToken);
          getUserCart(newToken);
          getUserWishlist(newToken);
          getUserDetails(newToken);
        })
        .catch(() => {
          // Refresh failed, clear tokens
          authService.clearTokens();
          setToken("");
        });
    }
  }, []);

  const value = {
    products,
    collection,
    // currency,
    currency: currencySymbols[currencyCode],
    currencyCode,
    setCurrencyCode,
    convertPrice,
    delivery_fee,
    setDeliveryFee,
    deliveryFees,
    selectedLocation,
    setSelectedLocation,
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
    getUserDetails,
    userData,
    subscribeToMailchimp,
    // VAT_RATE,
    // getVAT,
    // formatNumberWithCommas,
    formatPrice,
    supportedCurrencies,
    userOrders,
    locationToState,
    getCartWeight,
    getShippingCost,
    selectedCountry,
    setSelectedCountry,
    isInternational,
    logout,
    localDelivery,
    // sections,
    // getSections,
  };

  return (
    <shopContext.Provider value={value}>{props.children}</shopContext.Provider>
  );
};

export default ShopContextProvider;
