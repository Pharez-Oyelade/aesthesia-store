import { createContext, useEffect, useState } from "react";
import { TbCurrencyNaira } from "react-icons/tb";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const shopContext = createContext();

const currencySymbols = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
};

const supportedCurrencies = ["NGN", "USD", "GBP", "EUR"];

const deliveryFees = {
  "Lagos Mainland": 1000,
  "Lagos Island": 1500,
  Abuja: 2500,
  Other: 3000,
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
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const [selectedLocation, setSelectedLocation] = useState("");
  const [delivery_fee, setDeliveryFee] = useState(0);

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
    if (selectedLocation && deliveryFees[selectedLocation] !== undefined) {
      setDeliveryFee(deliveryFees[selectedLocation]);
    } else {
      setDeliveryFee(0);
    }
  }, [selectedLocation]);

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
    // VAT_RATE,
    // getVAT,
    // formatNumberWithCommas,
    formatPrice,
    supportedCurrencies,
  };

  return (
    <shopContext.Provider value={value}>{props.children}</shopContext.Provider>
  );
};

export default ShopContextProvider;
