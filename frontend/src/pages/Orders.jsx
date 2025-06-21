import React, { useEffect, useState, useContext } from "react";
import { shopContext } from "../context/ShopContext";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const { currency, delivery_fee } = useContext(shopContext);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("orders") || "[]");
    setOrders(stored.reverse());
  }, []);

  if (orders.length === 0) {
    return (
      <div className="max-w-2xl mx-auto mt-20 text-center text-gray-600">
        <h2 className="text-2xl font-bold mb-4">No Orders Yet</h2>
        <p>Place an order to see it here.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto mt-10">
      <h2 className="text-2xl font-bold mb-8 text-center">Your Orders</h2>
      <div className="space-y-8">
        {orders.map((order) => (
          <div key={order.id} className="bg-white rounded-xl shadow p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
              <div>
                <span className="font-semibold">Order ID:</span> {order.id}
              </div>
              <div className="text-sm text-gray-500">{order.date}</div>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Status:</span>{" "}
              <span className="text-green-600">{order.status}</span>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Billing:</span>{" "}
              {order.billing.name}, {order.billing.email}, {order.billing.phone}
              , {order.billing.address}, {order.billing.city},{" "}
              {order.billing.country}
            </div>
            <div className="mb-2">
              <span className="font-semibold">Subtotal:</span>{" "}
              <div className="flex items-center">
                {currency}
                {order.total}
              </div>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Delivery Fee:</span>{" "}
              <div className="flex items-center">
                {currency}
                {delivery_fee}
              </div>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Total:</span>{" "}
              <b className="flex items-center">
                {currency}
                {Number(order.total) + Number(delivery_fee)}
              </b>
            </div>
            <div className="mb-2">
              <span className="font-semibold">Items:</span>
              <ul className="list-disc ml-6 mt-1">
                {Object.entries(order.cart).map(([itemId, sizes]) =>
                  Object.entries(sizes).map(([size, measurementsObj]) =>
                    Object.entries(measurementsObj).map(([mKey, qty]) => {
                      const measurements = JSON.parse(mKey);
                      return (
                        <li key={itemId + size + mKey} className="text-sm">
                          <span className="font-medium">{itemId}</span> | Size:{" "}
                          {size} | Qty: {qty} |{" "}
                          {Object.entries(measurements)
                            .map(([k, v]) => `${k}: ${v}`)
                            .join(", ")}
                        </li>
                      );
                    })
                  )
                )}
              </ul>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              Tracking: {order.status} (demo)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Orders;
