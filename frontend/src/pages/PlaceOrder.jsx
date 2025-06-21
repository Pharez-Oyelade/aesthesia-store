import React, { useContext, useState } from "react";
import { shopContext } from "../context/ShopContext";
import { useNavigate } from "react-router-dom";

const PlaceOrder = () => {
  const { cartItems, products, getCartAmount, setCartItems } =
    useContext(shopContext);
  const [billing, setBilling] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    country: "Nigeria",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setBilling({ ...billing, [e.target.name]: e.target.value });
  };

  const handlePaystack = (e) => {
    e.preventDefault();
    setLoading(true);
    // Here you would integrate Paystack payment logic
    setTimeout(() => {
      setLoading(false);
      // Save order to localStorage or backend (for demo, localStorage)
      const orders = JSON.parse(localStorage.getItem("orders") || "[]");
      orders.push({
        id: Date.now(),
        billing,
        cart: cartItems,
        total: getCartAmount(),
        status: "Processing",
        date: new Date().toLocaleString(),
      });
      localStorage.setItem("orders", JSON.stringify(orders));
      // Clear cart
      setCartItems({});
      navigate("/orders");
    }, 2000);
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-8 mt-10">
      <h2 className="text-2xl font-bold mb-6 text-center">
        Billing Information
      </h2>
      <form onSubmit={handlePaystack} className="flex flex-col gap-4">
        <input
          type="text"
          name="name"
          value={billing.name}
          onChange={handleChange}
          placeholder="Full Name"
          className="border rounded-lg px-4 py-2"
          required
        />
        <input
          type="email"
          name="email"
          value={billing.email}
          onChange={handleChange}
          placeholder="Email"
          className="border rounded-lg px-4 py-2"
          required
        />
        <input
          type="tel"
          name="phone"
          value={billing.phone}
          onChange={handleChange}
          placeholder="Phone Number"
          className="border rounded-lg px-4 py-2"
          required
        />
        <input
          type="text"
          name="address"
          value={billing.address}
          onChange={handleChange}
          placeholder="Address"
          className="border rounded-lg px-4 py-2"
          required
        />
        <input
          type="text"
          name="city"
          value={billing.city}
          onChange={handleChange}
          placeholder="City"
          className="border rounded-lg px-4 py-2"
          required
        />
        <select
          name="country"
          value={billing.country}
          onChange={handleChange}
          className="border rounded-lg px-4 py-2"
        >
          <option value="Nigeria">Nigeria</option>
          <option value="Ghana">Ghana</option>
          <option value="Kenya">Kenya</option>
          <option value="South Africa">South Africa</option>
        </select>
        <button
          type="submit"
          className="bg-green-600 text-white py-3 rounded-lg font-bold mt-4 hover:bg-green-700 transition"
          disabled={loading}
        >
          {loading ? "Processing..." : "Pay with Paystack"}
        </button>
      </form>
      <div className="mt-6 text-center text-gray-500 text-sm">
        <p>After payment, you will be redirected to your orders page.</p>
      </div>
    </div>
  );
};

export default PlaceOrder;
