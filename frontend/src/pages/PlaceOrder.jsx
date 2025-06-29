import React, { useContext, useState } from "react";
import Title from "../components/Title";
import CartTotal from "../components/CartTotal";
import { assets } from "../assets/assets";
import { shopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const PAYSTACK_PUBLIC_KEY = "pk_test_c4b2eb84f0a0f617c83c345b25ba357a5169a821"; // Replace with your real key

const PlaceOrder = () => {
  const [method, setMethod] = useState("cod");

  const {
    navigate,
    token,
    backendUrl,
    cartItems,
    setCartItems,
    getCartAmount,
    delivery_fee,
    products,
  } = useContext(shopContext);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    street: "",
    city: "",
    state: "",
    phone: "",
  });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setFormData((data) => ({ ...data, [name]: value }));
  };

  // Build order items as in your current logic
  const buildOrderItems = () => {
    let orderItems = [];
    for (const itemId in cartItems) {
      for (const size in cartItems[itemId]) {
        for (const mKey in cartItems[itemId][size]) {
          if (cartItems[itemId][size][mKey] > 0) {
            const product = products.find((p) => p._id === itemId);
            if (product) {
              orderItems.push({
                _id: itemId,
                name: product.name,
                price: product.price,
                image: product.image,
                size,
                measurements: JSON.parse(mKey),
                quantity: cartItems[itemId][size][mKey],
              });
            }
          }
        }
      }
    }
    return orderItems;
  };

  // Paystack Inline Handler
  const payWithPaystack = () => {
    if (!token) {
      toast.error("You must be logged in to place an order.");
      return;
    }

    if (!window.PaystackPop) {
      toast.error("Paystack script not loaded");
      return;
    }
    const amount = getCartAmount() + delivery_fee;
    const handler = window.PaystackPop.setup({
      key: PAYSTACK_PUBLIC_KEY,
      email: formData.email,
      amount: amount * 100, // Paystack expects kobo
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
    try {
      const orderItems = buildOrderItems();
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
        reference: response.reference,
      };
      const res = await axios.post(
        backendUrl + "/api/order/paystack",
        orderData,
        { headers: { token } }
      );
      if (res.data.success) {
        setCartItems({});
        navigate("/orders");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      toast.error(error.message);
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
      return;
    }
    try {
      const orderItems = buildOrderItems();
      let orderData = {
        address: formData,
        items: orderItems,
        amount: getCartAmount() + delivery_fee,
      };
      const response = await axios.post(
        backendUrl + "/api/order/place",
        orderData,
        { headers: { token } }
      );
      if (response.data.success) {
        setCartItems({});
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
        {/* .......LEFT SIDE........... */}
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
            <input
              onChange={onChangeHandler}
              name="state"
              value={formData.state}
              className="border border-gray-300 rounded py-1.5 px-3.5 w-full"
              type="text"
              placeholder="State"
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
        </div>

        {/* .........RIGHT SIDE........ */}
        <div className="mt-8">
          <div className="mt-8 min-w-80">
            <CartTotal />
          </div>

          <div className="mt-12">
            <Title text1={"PAYMENT"} text2={"METHOD"} />
            {/* .......PAYMENT METHOD........... */}
            <div className="flex gap-3 flex-col lg:flex:row">
              {/* ...other payment methods... */}
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
              <div
                onClick={() => setMethod("cod")}
                className={`flex items-center gap-3 border p-2 px-3 cursor-pointer ${
                  method === "cod" ? "border-green-400" : ""
                }`}
              >
                <p
                  className={`min-w-3.5 h-3.5 border rounded-full ${
                    method === "cod" ? "bg-green-400" : ""
                  }`}
                ></p>
                <p className="text-gray-500 text-sm font-medium mx-4">
                  CASH ON DELIVERY
                </p>
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
                <button
                  type="submit"
                  className="bg-black text-white px-16 py-3 text-sm"
                >
                  PLACE ORDER
                </button>
              )}
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default PlaceOrder;
