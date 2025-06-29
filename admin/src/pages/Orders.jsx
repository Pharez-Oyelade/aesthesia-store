import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axios from "axios";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);

  const fetchAllOrders = async () => {
    if (!token) {
      return null;
    }

    try {
      const response = await axios.post(
        backendUrl + "/api/order/list",
        {},
        { headers: { token } }
      );
      if (response.data.success) {
        setOrders(response.data.orders.reverse());
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/order/status",
        {
          orderId,
          status: event.target.value,
        },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(response.data.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  return (
    <div className="max-w-6xl mx-auto py-8">
      <h3 className="text-3xl font-bold text-red-700 mb-8">Orders</h3>
      <div className="flex flex-col gap-6">
        {orders.map((order, index) => (
          <div
            className="bg-white shadow-lg rounded-2xl p-8 border border-gray-100 flex flex-col md:grid md:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-6 items-start"
            key={index}
          >
            <img
              className="w-14 h-14 object-cover rounded-lg border"
              src={assets.parcel_icon}
              alt=""
            />
            <div>
              <div>
                {order.items.map((item, idx) => (
                  <div className="py-1" key={idx}>
                    <p className="font-semibold">
                      {item.name} x {item.quantity}{" "}
                      {item.size && (
                        <span className="text-gray-500">({item.size})</span>
                      )}
                    </p>
                    {item.measurements && (
                      <p className="text-xs text-gray-500">
                        Measurements:{" "}
                        {Object.entries(item.measurements)
                          .map(([k, v]) => `${k}: ${v}`)
                          .join(", ")}
                      </p>
                    )}
                  </div>
                ))}
              </div>
              <p className="mt-3 mb-2 font-medium text-lg text-gray-700">
                {order.address.firstName + " " + order.address.lastName}
              </p>
              <div className="text-gray-500">
                <p>{order.address.street + ","}</p>
                <p>{order.address.city + ", " + order.address.state}</p>
              </div>
              <p className="text-gray-500">{order.address.phone}</p>
            </div>
            <div>
              <p className="text-base font-semibold text-gray-700">
                Items: {order.items.length}
              </p>
              <p className="mt-3">
                Payment Method:{" "}
                <span className="font-medium">{order.paymentMethod}</span>
              </p>
              <p>
                Payment:{" "}
                <span
                  className={
                    order.payment ? "text-green-600" : "text-yellow-600"
                  }
                >
                  {order.payment ? "Done" : "Pending"}
                </span>
              </p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
            <p className="flex items-center gap-1 text-lg font-bold text-red-700">
              {currency} {order.amount}
            </p>
            <select
              onChange={(event) => statusHandler(event, order._id)}
              value={order.status}
              className="p-2 font-semibold rounded-lg border border-gray-300 bg-gray-50 focus:ring-2 focus:ring-red-200 transition"
            >
              <option value="Order Placed">Order Placed</option>
              <option value="Packing">Packing</option>
              <option value="Shipped">Shipped</option>
              <option value="Out for delivery">Out for delivery</option>
              <option value="Delivered">Delivered</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
