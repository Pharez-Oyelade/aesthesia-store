import React, { useContext, useState, useEffect } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { shopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PAYSTACK_PUBLIC_KEY = "pk_test_c4b2eb84f0a0f617c83c345b25ba357a5169a821";
// const PAYSTACK_PUBLIC_KEY = "pk_live_65339f2e907214cfc666681ca71100b0c0d4d5ea ";

const PlaceOrder = () => {
  const [method, setMethod] = useState("paystack");
  const [filteredLocations, setFilteredLocations] = useState([]);

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
    delivery_fee,
    locationToState,
    getShippingCost,
    selectedCountry,
    setSelectedCountry,
  } = useContext(shopContext);

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
        const isValidLocation = filtered.some((loc) =>
          loc.areas.includes(selectedLocation)
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
                orderItems.push({
                  _id: itemId,
                  name: product.name,
                  price: product.price,
                  image: product.image,
                  size,
                  color: colorKey === "no-color" ? "" : colorKey,
                  measurements: JSON.parse(mKey),
                  quantity: cartItems[itemId][size][colorKey][mKey],
                });
              }
            }
          }
        }
      }
    }
    return orderItems;
  };

  // Validate delivery info fields
  const validateForm = () => {
    for (const key in formData) {
      // Skip state and deliveryLocation validation for non-Nigerian orders
      if ((key === "deliveryLocation" || key === "state") && selectedCountry !== "Nigeria") {
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

    // Ensure a delivery area is selected for Nigerian orders
    if (selectedCountry === "Nigeria" && !selectedLocation) {
      console.log("Missing delivery location"); // Debug log
      return false;
    }

    return true;
  };

  // Paystack Inline Handler
  const payWithPaystack = () => {
    if (!validateForm()) {
      toast.error("Please fill in all delivery information fields.");
      return;
    }

    if (!token) {
      toast.error("You must be logged in to place an order.");
      navigate("/login");
      return;
    }

    if (!window.PaystackPop) {
      toast.error("Paystack script not loaded");
      return;
    }

    const amount = getCartAmount() + getShippingCost();
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: formData.email,
      amount: Math.round(amount * 100),
      firstname: formData.firstName,
      lastname: formData.lastName,
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
        amount: getCartAmount() + getShippingCost(),
        reference: response.reference,
      };

      const res = await axios.post(
        backendUrl + "/api/order/paystack",
        orderData,
        {
          headers: { token },
          timeout: 30000, // 30 second timeout
        }
      );

      if (res.data.success) {
        // Clear cart and navigation
        setCartItems({});
        setSelectedCountry("");
        setSelectedLocation("");

        if (res.data.isDuplicate) {
          toast.info("Order already processed successfully");
        } else {
          toast.success("Order placed successfully!");
        }

        navigate("/orders");
      } else {
        // Payment succeeded but order creation failed
        const errorMsg = res.data.message || "Order processing failed";

        if (res.data.reference) {
          toast.error(
            `${errorMsg}. Your payment reference: ${res.data.reference}. Please contact support.`,
            { autoClose: false }
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
          { autoClose: false }
        );
      } else {
        toast.error(
          error.response?.data?.message ||
            "An error occurred. Please contact support if payment was deducted."
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
    if (!token) {
      toast.error("You must be logged in to place an order.");
      navigate("/login");
      return;
    }
    try {
      const orderItems = buildOrderItems();
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + getShippingCost(),
      };
      const response = await axios.post(
        backendUrl + "/api/order/place",
        orderData,
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems({});
        setSelectedLocation("");
        setSelectedCountry("");
        navigate("/orders");
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
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
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
              {/* <option value="Oyo">Oyo</option> */}
            </select>
          )}

          {/* Delivery Location - Only shown after state is selected */}
          {selectedCountry === "Nigeria" && formData.state && (
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
            type="number"
            placeholder="Phone"
            required
          />

          <p className="text-sm text-gray-700">
            *Enter a valid email address to receive payment receipt
          </p>
          <p className="text-md font-bold">
            NOTE: This outfit requires 7 working days for production.
          </p>
        </div>

        {/* RIGHT SIDE */}
        <div className="mt-8">
          <div className="mt-8 min-w-80">
            <CartTotal />
          </div>

          <div className="mt-12">
            <Title text1={"PAYMENT"} text2={"METHOD"} />

            <div className="flex gap-3 flex-col lg:flex:row">
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
                  disabled={!token}
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
    </div>
  );
};

export default PlaceOrder;
