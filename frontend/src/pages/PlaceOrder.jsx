import React, { useContext, useState, useEffect } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { shopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import { trackOrderPlaced, updateMetaAdvancedMatching } from "../utils/metaPixel";
import { trackOrderPlaced as trackOrderPlacedTT } from "../utils/tiktokPixel";

const PAYSTACK_PUBLIC_KEY = import.meta.env.VITE_PAYSTACK_KEY;

const parseCartMeasurements = (mKey) => {
  try {
    return JSON.parse(mKey);
  } catch {
    return {};
  }
};

const PlaceOrder = () => {
  const [method, setMethod] = useState("paystack");
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isGuestMode, setIsGuestMode] = useState(false);

  // Discount code state
  const [discountCode, setDiscountCode] = useState("");
  const [discountData, setDiscountData] = useState(null);
  const [discountLoading, setDiscountLoading] = useState(false);
  const [discountError, setDiscountError] = useState("");

  const {
    navigate,
    currency,
    token,
    backendUrl,
    cartItems,
    setCartItems,
    getCartAmount,
    products,
    setSelectedLocation,
    selectedLocation,
    localDelivery,
    locationToState,
    getShippingCost,
    selectedCountry,
    setSelectedCountry,
    getPlusSizeFee,
    getCustomColorFee,
    PLUS_SIZE_FEE,
    CUSTOM_COLOR_FEE,
    CUSTOM_COLOR_NOTE_KEY,
    isPlusSize,
    isCustomColor,
    convertPrice,
    isDiscountWaitlistEnabled,
  } = useContext(shopContext);

  // Check authentication on component mount - show modal but don't block
  useEffect(() => {
    if (!token && !isGuestMode) {
      setShowAuthModal(true);
    }
  }, [token, isGuestMode]);

  // Dynamically load Paystack inline.js only on this page (not globally).
  // This keeps the 10 KiB script out of the critical path for all other pages.
  useEffect(() => {
    if (document.getElementById("paystack-script")) return; // already loaded
    const script = document.createElement("script");
    script.id = "paystack-script";
    script.src = "https://js.paystack.co/v1/inline.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      // Leave the script in DOM on unmount so re-visiting the page is instant.
      // The global PaystackPop object persists until full page reload.
    };
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    phone: "",
    country: "",
    deliveryLocation: "",
  });

  // Filter locations whenever state changes
  useEffect(() => {
    if (formData.state) {
      const filtered = localDelivery.filter((loc) => {
        // Extract state from location name (e.g., "Lagos Island 1" -> "Lagos")
        const locState = locationToState[loc.location];
        return locState === formData.state;
      });
      setFilteredLocations(filtered);

      // Reset selected location if it doesn't match the new state
      if (selectedLocation) {
        const isValidLocation = filtered.some(
          (loc) =>
            (Array.isArray(loc.areas) &&
              loc.areas.includes(selectedLocation)) ||
            loc.location === selectedLocation,
        );
        if (!isValidLocation) {
          setSelectedLocation("");
        }
      }
    } else {
      setFilteredLocations([]);
      setSelectedLocation("");
    }
  }, [formData.state, localDelivery, locationToState]);

  useEffect(() => {
    selectedCountry === "United States" && setShowModal(true);
  }, [selectedCountry]);

  // Handle country change
  const onCountryChange = (e) => {
    const country = e.target.value;
    setSelectedCountry(country);

    if (country !== "Nigeria") {
      setSelectedLocation("");
      setFormData((data) => ({
        ...data,
        country,
        state: "", // Reset state for international orders
        deliveryLocation: "", // Reset delivery location for international orders
      }));
    } else {
      setFormData((data) => ({
        ...data,
        country,
      }));
    }
  };

  // Handle state change
  const handleStateChange = (e) => {
    const state = e.target.value;
    setFormData((data) => ({
      ...data,
      state,
      deliveryLocation: "", // Reset delivery location when state changes
    }));

    // If this state uses manual entry (no predefined areas), auto-select its delivery group
    const manualStateToGroup = {
      North: "Northern States",
      East: "Eastern States",
    };

    if (manualStateToGroup[state]) {
      setSelectedLocation(manualStateToGroup[state]);
    } else {
      // clear any previously selected group when switching to normal states
      setSelectedLocation("");
    }
  };

  // Handle location/area change
  const onLocationChange = (e) => {
    const area = e.target.value;
    setSelectedLocation(area);

    // Find the location group this area belongs to
    const locationGroup = localDelivery.find((loc) => loc.areas.includes(area));

    if (locationGroup) {
      const state = locationToState[locationGroup.location];
      setFormData((data) => ({
        ...data,
        state: state || data.state,
        deliveryLocation: area,
      }));
    }
  };

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  const buildOrderItems = () => {
    let orderItems = [];
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        for (const colorKey in cartItems[itemId][size]) {
          for (const mKey in cartItems[itemId][size][colorKey]) {
            if (cartItems[itemId][size][colorKey][mKey] > 0) {
              const product = products.find((p) => p._id === itemId);
              if (product) {
                const cartMeasurements = parseCartMeasurements(mKey);
                const {
                  [CUSTOM_COLOR_NOTE_KEY]: customColorNote,
                  note,
                  ...measurements
                } = cartMeasurements;
                const color = colorKey === "no-color" ? "" : colorKey;
                const quantity = cartItems[itemId][size][colorKey][mKey];
                const plusSizeFee = isPlusSize(size) ? PLUS_SIZE_FEE : 0;
                const customColorFee = isCustomColor(color)
                  ? CUSTOM_COLOR_FEE
                  : 0;
                const unitPrice = product.onSale
                  ? product.salePrice
                  : product.price;

                orderItems.push({
                  _id: itemId,
                  name: product.name,
                  price: unitPrice,
                  image: product.image,
                  size,
                  color,
                  measurements,
                  note: customColorNote || note || "",
                  customColorNote: customColorNote || note || "",
                  plusSizeFee,
                  customColorFee,
                  lineTotal:
                    (unitPrice + plusSizeFee + customColorFee) * quantity,
                  quantity,
                });
              }
            }
          }
        }
      }
    }
    return orderItems;
  };

  useEffect(() => {
    setDiscountData((currentDiscount) => {
      if (!currentDiscount) return currentDiscount;
      setDiscountError("Your cart changed. Please reapply your discount code.");
      return null;
    });
  }, [cartItems]);

  // Validate delivery info fields
  const validateForm = () => {
    for (const key in formData) {
      // Skip state and deliveryLocation validation for non-Nigerian orders
      if (
        (key === "deliveryLocation" || key === "state") &&
        selectedCountry !== "Nigeria"
      ) {
        continue;
      }

      // For the country field, prefer the context `selectedCountry` value
      if (key === "country") {
        const countryValue = selectedCountry || formData.country;
        if (!countryValue || countryValue.toString().trim() === "") {
          console.log("Missing field: country", countryValue);
          return false;
        }
        continue;
      }

      if (!formData[key] || formData[key].toString().trim() === "") {
        console.log("Missing field:", key, formData[key]); // Debug log
        return false;
      }
    }

    // Ensure a delivery area or deliveryLocation is provided for Nigerian orders
    if (selectedCountry === "Nigeria") {
      const hasTyped =
        formData.deliveryLocation &&
        formData.deliveryLocation.toString().trim() !== "";
      const hasSelected =
        selectedLocation && selectedLocation.toString().trim() !== "";
      if (!hasTyped && !hasSelected) {
        console.log("Missing delivery location"); // Debug log
        return false;
      }
    }

    return true;
  };

  // Validate discount code
  const validateDiscount = async () => {
    if (!isDiscountWaitlistEnabled) {
      setDiscountData(null);
      setDiscountError("Discount codes are not available right now.");
      return;
    }

    if (!discountCode.trim()) {
      setDiscountError("Please enter a discount code.");
      return;
    }

    setDiscountLoading(true);
    setDiscountError("");

    try {
      const response = await axios.post(
        backendUrl + "/api/discounts/validate",
        {
          code: discountCode.trim(),
          items: buildOrderItems(),
        },
      );

      if (response.data.success) {
        setDiscountData(response.data);
        setDiscountError("");
        toast.success(
          response.data.message || "Discount code applied successfully!",
        );
      } else {
        setDiscountData(null);
        setDiscountError(response.data.message || "Invalid discount code.");
        if (response.data.validCode) {
          toast.info(response.data.message);
        }
      }
    } catch (error) {
      setDiscountData(null);
      setDiscountError(
        error.response?.data?.message ||
          error.response?.data?.error ||
          "Failed to validate discount code.",
      );
    } finally {
      setDiscountLoading(false);
    }
  };

  // Clear discount
  const clearDiscount = () => {
    setDiscountCode("");
    setDiscountData(null);
    setDiscountError("");
  };

  const getOrderSubtotal = () =>
    getCartAmount() +
    getShippingCost() +
    getPlusSizeFee() +
    getCustomColorFee();

  const getDiscountBaseAmount = () =>
    discountData?.eligibleSubtotal ?? getCartAmount();

  const getDiscountAmount = () =>
    isDiscountWaitlistEnabled
      ? Math.min(discountData?.discountAmount || 0, getDiscountBaseAmount())
      : 0;

  const getPayableAmount = () =>
    Math.max(getOrderSubtotal() - getDiscountAmount(), 0);

  const payWithPaystack = () => {
    if (!validateForm()) {
      toast.error("Please fill in all delivery information fields.");
      return;
    }

    updateMetaAdvancedMatching(formData);

    if (!window.PaystackPop) {
      toast.error("Paystack is still loading, please try again in a moment.");
      return;
    }

    const amount = getPayableAmount();
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: formData.email,
      amount: Math.round(amount * 100),
      firstname: formData.firstName,
      lastname: formData.lastName,
      metadata: {
        items: buildOrderItems(),
        address: formData,
        isGuest: !token,
        discountCode: isDiscountWaitlistEnabled
          ? discountData?.code || null
          : null,
        discountAmount: getDiscountAmount(),
        preDiscountAmount: getOrderSubtotal(),
        discountBaseAmount: getDiscountBaseAmount(),
        discountScope: discountData?.discountScope || null,
        eligibleCollections: discountData?.eligibleCollections || [],
        payableAmount: amount,
      },
      callback: function (response) {
        handlePaystackSuccess(response);
      },
      onClose: function () {
        toast.info("Payment cancelled");
      },
    });
    handler.openIframe();
  };

  // On Paystack Success
  const handlePaystackSuccess = async (response) => {
    // Show processing message
    toast.info("Processing your order... Please wait.");

    try {
      const orderItems = buildOrderItems();
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getPayableAmount(),
        preDiscountAmount: getOrderSubtotal(),
        discountBaseAmount: getDiscountBaseAmount(),
        discountAmount: getDiscountAmount(),
        discountScope: discountData?.discountScope || null,
        eligibleCollections: discountData?.eligibleCollections || [],
        reference: response.reference,
      };

      // Add discount code if applied
      if (isDiscountWaitlistEnabled && discountData && discountData.code) {
        orderData.discountCode = discountData.code;
      }

      // Only include token header if user is authenticated
      const headers = token ? { token } : {};
      const res = await axios.post(
        backendUrl + "/api/order/paystack",
        orderData,
        {
          headers,
          timeout: 30000, // 30 second timeout
        },
      );

      if (res.data.success) {
        if (!res.data.isDuplicate) {
          trackOrderPlaced(orderItems, getPayableAmount(), {
            orderId: res.data.orderId,
            reference: response.reference,
            paymentMethod: "paystack",
          });
          trackOrderPlacedTT(orderItems, getPayableAmount());
        }

        // Clear waitlist code and set dismissed flag
        if (discountData && discountData.code) {
          localStorage.removeItem("aest_waitlist_code");
          localStorage.setItem("aest_waitlist_dismissed", "true");
        }

        // Save guest order to localStorage if guest
        if ((isGuestMode || !token) && res.data.orderId) {
          try {
            const guestOrder = {
              orderId: res.data.orderId,
              email: formData.email,
              date: Date.now(),
              reference: response.reference,
            };
            const existingOrders = JSON.parse(
              localStorage.getItem("guestOrders") || "[]",
            );
            existingOrders.push(guestOrder);
            localStorage.setItem("guestOrders", JSON.stringify(existingOrders));
          } catch (e) {
            console.error("Error saving guest order:", e);
          }
        }

        // Clear cart and navigation
        setCartItems({});
        setSelectedCountry("");
        setSelectedLocation("");
        setIsGuestMode(false);

        if (res.data.isDuplicate) {
          toast.info("Order already processed successfully");
        } else {
          toast.success("Order placed successfully!");
        }

        // For guest orders, show order reference instead of navigating to orders page
        if (isGuestMode || !token) {
          toast.info(
            `Order placed! Check your email (${formData.email}) for confirmation. Order ID: ${res.data.orderId}`,
            { autoClose: 10000 },
          );
          // Optionally navigate to a success page or home
          navigate("/");
        } else {
          navigate("/orders");
        }
      } else {
        // Payment succeeded but order creation failed
        const errorMsg = res.data.message || "Order processing failed";

        if (res.data.reference) {
          toast.error(
            `${errorMsg}. Your payment reference: ${res.data.reference}. Please contact support.`,
            { autoClose: false },
          );
        } else {
          toast.error(errorMsg);
        }
      }
    } catch (error) {
      console.error("Order processing error:", error);

      // Handle network errors
      if (error.code === "ECONNABORTED" || !error.response) {
        toast.error(
          `Network error. Your payment was successful (Ref: ${response.reference}). Please contact support to confirm your order.`,
          { autoClose: false },
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            "An error occurred. Please contact support if payment was deducted.",
        );
      }
    }
  };

  // COD and other payment methods
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    if (method === "paystack") {
      payWithPaystack();
      return;
    }
    
    updateMetaAdvancedMatching(formData);
    try {
      const orderItems = buildOrderItems();
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getPayableAmount(),
        preDiscountAmount: getOrderSubtotal(),
        discountBaseAmount: getDiscountBaseAmount(),
        discountAmount: getDiscountAmount(),
        discountScope: discountData?.discountScope || null,
        eligibleCollections: discountData?.eligibleCollections || [],
      };

      // Add discount code if applied
      if (isDiscountWaitlistEnabled && discountData && discountData.code) {
        orderData.discountCode = discountData.code;
      }

      // Only include token header if user is authenticated
      const headers = token ? { token } : {};
      const response = await axios.post(
        backendUrl + "/api/order/place",
        orderData,
        { headers },
      );
      if (response.data.success) {
        // Clear waitlist code and set dismissed flag
        if (discountData && discountData.code) {
          localStorage.removeItem("aest_waitlist_code");
          localStorage.setItem("aest_waitlist_dismissed", "true");
        }

        // Save guest order to localStorage if guest
        if ((isGuestMode || !token) && response.data.orderId) {
          try {
            const guestOrder = {
              orderId: response.data.orderId,
              email: formData.email,
              date: Date.now(),
            };
            const existingOrders = JSON.parse(
              localStorage.getItem("guestOrders") || "[]",
            );
            existingOrders.push(guestOrder);
            localStorage.setItem("guestOrders", JSON.stringify(existingOrders));
          } catch (e) {
            console.error("Error saving guest order:", e);
          }
        }

        setCartItems({});
        setSelectedLocation("");
        setSelectedCountry("");
        setIsGuestMode(false);

        // For guest orders, show order reference instead of navigating to orders page
        if (isGuestMode || !token) {
          toast.success(
            `Order placed! Check your email (${formData.email}) for confirmation. Order ID: ${response.data.orderId}`,
            { autoClose: 10000 },
          );
          navigate("/");
        } else {
          navigate("/orders");
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="">
      <form
        onSubmit={onSubmitHandler}
        className="flex flex-col sm:flex-row justify-between gap-4 pt-5 sm:pt-14 min-h-[80vh] border-t"
      >
        {/* LEFT SIDE */}
        <div className="flex flex-col gap-4 w-full sm:max-w-[480px]">
          <div className="text-xl sm:text-2xl my-3">
            <Title text1={"DELIVERY"} text2={"INFORMATION"} />
          </div>

          <div className="flex gap-3">
            <input
              onChange={onChangeHandler}
              name="firstName"
              value={formData.firstName}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              placeholder="First name"
              required
            />
            <input
              onChange={onChangeHandler}
              name="lastName"
              value={formData.lastName}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              placeholder="Last name"
              required
            />
          </div>

          <input
            onChange={onChangeHandler}
            name="email"
            value={formData.email}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="email"
            placeholder="Email Address"
            required
          />

          <select
            name="country"
            value={selectedCountry}
            onChange={onCountryChange}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            required
          >
            <option value="">Select Country</option>
            <option value="Nigeria">Nigeria</option>
            <optgroup label="International">
              {/* <option value="Australia">Australia</option> */}
              {/* <option value="Belgium">Belgium</option> */}
              {/* <option value="Cameroon">Cameroon</option> */}
              <option value="Canada">Canada</option>
              <option value="France">France</option>
              {/* <option value="Germany">Germany</option> */}
              <option value="Ghana">Ghana</option>
              <option value="Italy">Italy</option>
              {/* <option value="Netherlands">Netherlands</option> */}
              <option value="Qatar">Qatar</option>
              <option value="South Africa">South Africa</option>
              {/* <option value="Togo">Togo</option> */}
              {/* <option value="Spain">Spain</option> */}
              <option value="United Arab Emirates">UAE</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="United States">United States</option>
            </optgroup>
          </select>

          {/* State Selection - Only for Nigeria */}
          {selectedCountry === "Nigeria" && (
            <select
              name="state"
              value={formData.state}
              onChange={handleStateChange}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              required
            >
              <option value="">Select State</option>
              <option value="Lagos">Lagos</option>
              <option value="Oyo">Oyo</option>
              <option value="North">Northern States</option>
              <option value="East">Eastern States</option>
            </select>
          )}

          {/* Delivery Location - Only shown after state is selected */}
          {selectedCountry === "Nigeria" &&
            formData.state &&
            formData.state !== "North" &&
            formData.state !== "East" && (
              <>
                <select
                  name="location"
                  value={selectedLocation}
                  onChange={onLocationChange}
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  required
                >
                  <option value="">Select Delivery Area</option>
                  {filteredLocations.map((loc) => (
                    <optgroup
                      key={loc.location}
                      label={`${
                        loc.location
                      } (${currency}${loc.price.toLocaleString()})`}
                    >
                      {loc.areas.map((area) => (
                        <option key={area} value={area}>
                          {area}
                        </option>
                      ))}
                    </optgroup>
                  ))}
                </select>
                <p className="m-0 p-0 text-xs text-gray-500">
                  *Shipping fees based on delivery location
                </p>
              </>
            )}

          {selectedCountry === "Nigeria" &&
            formData.state &&
            (formData.state === "North" || formData.state === "East") && (
              <>
                <input
                  type="text"
                  value={formData.deliveryLocation}
                  onChange={(e) => {
                    const val = e.target.value;
                    setFormData((d) => ({ ...d, deliveryLocation: val }));
                    // select a matching free-text delivery group so fee is applied
                    const matchingGroup = filteredLocations.find(
                      (loc) =>
                        !Array.isArray(loc.areas) ||
                        loc.areas.length === 0 ||
                        loc.areas.every(
                          (a) => !a || a.toString().trim() === "",
                        ) ||
                        loc.areas.some((a) =>
                          a.toLowerCase().includes("other"),
                        ),
                    );
                    if (matchingGroup)
                      setSelectedLocation(matchingGroup.location);
                  }}
                  name="deliveryLocation"
                  className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
                  placeholder="Enter state / area"
                  required
                />
                <p className="m-0 p-0 text-xs text-gray-500">
                  *Shipping fees based on delivery location
                </p>
              </>
            )}

          <input
            onChange={onChangeHandler}
            name="street"
            value={formData.street}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="text"
            placeholder="Street"
            required
          />

          <div className="flex gap-3">
            <input
              onChange={onChangeHandler}
              name="city"
              value={formData.city}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              placeholder="City"
              required
            />
          </div>

          <input
            onChange={onChangeHandler}
            name="phone"
            value={formData.phone}
            className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
            type="tel"
            placeholder="Phone"
            required
          />

          <p className="text-sm text-gray-700">
            *Enter a valid email address to receive payment receipt
          </p>
          <p className="text-md font-bold">
            NOTE: Please allow us up to 7-10 working days to process your order
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="mt-8">
          {/* Discount Code Section */}
          {isDiscountWaitlistEnabled && (
            <div className="mt-8 min-w-80 bg-gray-50 p-5 rounded-lg border border-gray-200 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Apply Discount Code
              </h3>

              {discountData ? (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Applied Code</p>
                      <p className="text-lg font-bold text-green-700">
                        {discountData.code || discountCode.toUpperCase()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">Discount</p>
                      <p className="text-xl font-bold text-green-700">
                        -{currency}
                        {convertPrice(discountData.discountAmount)}
                      </p>
                    </div>
                  </div>

                  {discountData.discountScope === "collection" && (
                    <div className="mb-3 rounded border border-green-200 bg-white p-3 text-sm text-gray-700">
                      <p>
                        Applies only to:{" "}
                        <span className="font-medium">
                          {discountData.eligibleCollections?.join(", ")}
                        </span>
                      </p>
                      <p className="mt-1">
                        Eligible subtotal: {currency}
                        {convertPrice(discountData.eligibleSubtotal || 0)}
                      </p>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={clearDiscount}
                    className="w-full text-sm text-red-600 hover:text-red-700 font-medium py-2"
                  >
                    Remove Discount
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={discountCode}
                      onChange={(e) => setDiscountCode(e.target.value)}
                      placeholder="Enter discount code"
                      className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-400"
                      disabled={discountLoading}
                    />
                    <button
                      type="button"
                      onClick={validateDiscount}
                      disabled={discountLoading || !discountCode.trim()}
                      className="bg-gray-800 text-white px-4 py-2 rounded text-sm font-medium hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {discountLoading ? (
                        <span className="flex items-center gap-2">
                          <span className="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                          Validating...
                        </span>
                      ) : (
                        "Apply"
                      )}
                    </button>
                  </div>

                  {discountError && (
                    <p className="text-sm text-red-700 bg-red-50 p-3 rounded border border-red-200">
                      {discountError}
                    </p>
                  )}
                </div>
              )}
            </div>
          )}

          <div className="mt-8 min-w-80">
            <CartTotal discountAmount={getDiscountAmount()} />
          </div>

          <div className="mt-12">
            <Title text1={"PAYMENT"} text2={"METHOD"} />

            <div className="flex gap-3 flex-col lg:flex-row">
              <div
                onClick={() => setMethod("paystack")}
                className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${
                  method === "paystack" ? "border-green-400" : ""
                }`}
              >
                <p
                  className={`min-w-3.5 h-3.5 border rounded-full ${
                    method === "paystack" ? "bg-green-400" : ""
                  }`}
                ></p>
                <img src={assets.paystack_logo} className="h-5 ms-4" alt="" />
                <span className="text-gray-700 text-sm font-medium mx-4">
                  PAYSTACK
                </span>
              </div>
            </div>

            <div className="w-full text-end mt-8">
              {method === "paystack" ? (
                <button
                  type="button"
                  onClick={payWithPaystack}
                  className="bg-green-600 text-white px-16 py-3 text-sm rounded"
                >
                  Pay with Paystack
                </button>
              ) : (
                <p className="text-sm text-right text-gray-700 pt-3">
                  *select paystack for online payment
                </p>
              )}
            </div>
          </div>
        </div>
      </form>

      {showModal && (
        <div className="fixed inset-0 bg-black/90 flex items-center justify-center z-50">
          <div className="bg-white p-10 rounded relative max-w-md mx-4">
            <div className="flex items-center">
              <p>
                PS: Shipping to the US? Check our{" "}
                <Link to="/shipping-policy" className="text-blue-700 underline">
                  shipping policy
                </Link>{" "}
                for customs and import tax details
              </p>
            </div>
            <button
              className="absolute top-2 right-2 bg-red-700 hover:bg-red-800 transition text-white px-4 py-2 rounded-full text-base font-semibold shadow cursor-pointer"
              onClick={() => setShowModal(false)}
              title="Close"
            >
              X
            </button>
          </div>
        </div>
      )}

      {/* Authentication Required Modal */}
      {showAuthModal && !token && !isGuestMode && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-2xl max-w-sm w-full mx-4 p-8 text-center">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Ready to Checkout?
              </h2>
              <p className="text-gray-600">
                Sign in, create an account, or proceed as guest
              </p>
            </div>

            <div className="space-y-3 mb-8">
              <p className="text-sm text-gray-600 bg-blue-50 p-4 rounded">
                ✓ Save your cart for later <br />
                ✓ Track your orders <br />✓ Faster checkout next time
              </p>
            </div>

            <div className="space-y-3">
              <button
                onClick={() => {
                  setShowAuthModal(false);
                  navigate("/login?mode=signup");
                }}
                className="w-full bg-red-800 text-white py-3 rounded font-semibold hover:bg-red-700 transition duration-200"
              >
                Create New Account
              </button>

              <button
                onClick={() => {
                  setShowAuthModal(false);
                  navigate("/login?mode=login");
                }}
                className="w-full bg-gray-200 text-gray-900 py-3 rounded font-semibold hover:bg-gray-300 transition duration-200"
              >
                Sign In
              </button>

              <button
                onClick={() => {
                  setIsGuestMode(true);
                  setShowAuthModal(false);
                  toast.info(
                    "Proceeding as guest. Please fill in all delivery information.",
                  );
                }}
                className="w-full bg-green-600 text-white py-3 rounded font-semibold hover:bg-green-700 transition duration-200"
              >
                Proceed as Guest
              </button>

              <button
                onClick={() => setShowAuthModal(false)}
                className="w-full text-gray-600 py-3 rounded font-semibold hover:bg-gray-100 transition duration-200"
              >
                Continue Shopping
              </button>
            </div>

            <p className="text-xs text-gray-500 mt-6">
              {isGuestMode
                ? "You're checking out as a guest. Sign in to track your orders."
                : "Your cart items are saved locally and will sync when you log in"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;
