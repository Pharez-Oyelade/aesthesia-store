import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { shopContext } from "../context/ShopContext";
import axios from "axios";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-blue-100 text-blue-800",
  shipped: "bg-purple-100 text-purple-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
};

function formatDate(date) {
  const d = new Date(date);
  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

const CUSTOM_COLOR_NOTE_KEY = "customColorNote";

const getCustomColorNote = (item) =>
  item.customColorNote || item.note || item.measurements?.[CUSTOM_COLOR_NOTE_KEY] || "";

const formatMeasurements = (measurements = {}) =>
  Object.entries(measurements)
    .filter(
      ([key, value]) =>
        key !== CUSTOM_COLOR_NOTE_KEY && key !== "note" && value,
    )
    .map(([k, v]) => `${k}: ${v}`)
    .join(", ");

const Orders = () => {
  const { currency, delivery_fee, backendUrl, token, formatPrice } =
    useContext(shopContext);
  const navigate = useNavigate();
  const [orderData, setOrderData] = useState([]);
  const [guestOrders, setGuestOrders] = useState([]);

  const loadOrderData = async () => {
    try {
      if (!token) {
        // Load guest orders from localStorage if no token
        const savedGuestOrders = localStorage.getItem("guestOrders");
        if (savedGuestOrders) {
          try {
            setGuestOrders(JSON.parse(savedGuestOrders));
          } catch (e) {
            console.error("Error parsing guest orders:", e);
          }
        }
        return;
      }
      const response = await axios.post(
        backendUrl + "/api/order/userorders",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        let allOrdersItem = [];
        response.data.orders.forEach((order) => {
          order.items.forEach((item) => {
            item["status"] = order.status || "pending";
            item["payment"] = order.payment;
            item["paymentMethod"] = order.paymentMethod;
            item["date"] = order.date;
            allOrdersItem.push(item);
          });
        });
        setOrderData(allOrdersItem);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadOrderData();
    // eslint-disable-next-line
  }, [token]);

  // Show message for guest users
  if (!token) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center text-gray-600 px-4">
        <h2 className="text-2xl font-bold mb-4">My Orders</h2>
        {guestOrders.length > 0 ? (
          <div className="mt-8 space-y-4">
            <p className="text-gray-700 mb-4">
              You placed {guestOrders.length} order(s) as a guest:
            </p>
            {guestOrders.map((order, idx) => (
              <div
                key={idx}
                className="bg-white rounded-lg shadow p-4 border border-gray-200 text-left"
              >
                <p className="font-semibold">Order ID: {order.orderId}</p>
                <p className="text-sm text-gray-600">
                  Email: {order.email}
                </p>
                <p className="text-sm text-gray-600">
                  Date: {order.date ? formatDate(order.date) : "Unknown"}
                </p>
                <p className="text-xs text-gray-500 mt-2">
                  Check your email ({order.email}) for order confirmation and
                  tracking details.
                </p>
              </div>
            ))}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm text-gray-700 mb-3">
                Sign in to track all your orders in one place and get faster
                checkout next time.
              </p>
              <button
                onClick={() => navigate("/login?mode=login")}
                className="bg-red-800 text-white px-6 py-2 rounded font-semibold hover:bg-red-700 transition"
              >
                Sign In
              </button>
            </div>
          </div>
        ) : (
          <>
            <p className="mb-6">Sign in to view your orders.</p>
            <div className="space-x-4">
              <button
                onClick={() => navigate("/login?mode=login")}
                className="bg-red-800 text-white px-6 py-2 rounded font-semibold hover:bg-red-700 transition"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate("/login?mode=signup")}
                className="bg-gray-200 text-gray-900 px-6 py-2 rounded font-semibold hover:bg-gray-300 transition"
              >
                Create Account
              </button>
            </div>
          </>
        )}
      </div>
    );
  }

  if (orderData.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center text-gray-600">
        <h2 className="text-2xl font-bold mb-4">No Orders Yet</h2>
        <p>Place an order to see it here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-2 sm:mt-8 px-4">
      <h2 className="text-2xl font-bold mb-8 text-center">My Orders</h2>
      <div className="space-y-8">
        {[...orderData].map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col md:flex-row gap-6 bg-white rounded-xl shadow p-5 border border-gray-100"
          >
            <div className="flex-shrink-0 flex items-center justify-center">
              <img
                src={
                  Array.isArray(item.image) ? item.image[0]?.url : item.image
                }
                alt={item.name}
                className="w-28 h-28 object-cover rounded-lg border"
              />
            </div>
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-lg font-semibold">{item.name}</span>
                  {item.size && (
                    <span className="ml-2 px-2 py-0.5 bg-gray-100 text-xs rounded">
                      Size: {item.size}
                    </span>
                  )}
                </div>
                <div className="text-gray-500 text-sm mb-2">
                  Quantity: <span className="font-medium">{item.quantity}</span>
                </div>
                {item.color && (
                  <div className="text-xs text-gray-500 mb-2">
                    Color: {item.color}
                  </div>
                )}
                {getCustomColorNote(item) && (
                  <div className="text-xs text-red-700 mb-2">
                    Custom color note: {getCustomColorNote(item)}
                  </div>
                )}
                {formatMeasurements(item.measurements) && (
                  <div className="text-xs text-gray-400 mb-2">
                    Measurements: {formatMeasurements(item.measurements)}
                  </div>
                )}
                <div className="flex items-center gap-2 sm:gap-4 mt-2">
                  <span className="font-semibold text-red-700 flex items-center text-sm sm:text-base">
                    {/* {item.price + item.price * VAT_RATE} */}
                    {formatPrice(item.price * item.quantity)}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded text-xs font-semibold ${
                      statusColors[item.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                    {item.paymentMethod
                      ? item.paymentMethod.toUpperCase()
                      : "COD"}
                  </span>
                  <span className="px-2 py-0.5 rounded text-xs bg-gray-100 text-gray-700">
                    {item.payment ? "Paid" : "Unpaid"}
                  </span>
                </div>
              </div>
              {/* <div className="text-xs text-gray-400 mt-3">
                Ordered on:{" "}
                {item.date ? new Date(item.date).toLocaleString() : "Unknown"}                
              </div> */}

              <div className="text-xs text-gray-400 mt-3">
                Ordered on: {item.date ? formatDate(item.date) : "Unknown"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
