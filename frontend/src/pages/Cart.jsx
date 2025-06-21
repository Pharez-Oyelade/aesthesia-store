import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { shopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import CartTotal from "../components/CartTotal";

// Helper to parse measurements key
const parseMeasurements = (mKey) => {
  try {
    return JSON.parse(mKey);
  } catch {
    return {};
  }
};

const Cart = () => {
  const { cartItems, products, currency, updateQuantity, navigate } =
    useContext(shopContext);

  // Flatten cartItems into an array for rendering
  const cartData = [];
  for (const itemId in cartItems) {
    for (const size in cartItems[itemId]) {
      for (const mKey in cartItems[itemId][size]) {
        if (cartItems[itemId][size][mKey] > 0) {
          cartData.push({
            _id: itemId,
            size,
            measurements: parseMeasurements(mKey),
            quantity: cartItems[itemId][size][mKey],
            mKey,
          });
        }
      }
    }
  }

  if (cartData.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <Link to="/" className="text-red-600 underline">
          Go shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Your Cart</h2>
      <div className="space-y-6">
        {cartData.map((item, idx) => {
          const product = products.find((p) => p._id === item._id);
          if (!product) return null;
          return (
            <div
              key={item._id + item.size + item.mKey}
              className="flex flex-col md:flex-row items-start md:items-center gap-6 border-b pb-4"
            >
              <img
                src={product.image[0]}
                alt={product.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium text-lg">{product.name}</h3>
                <p className="text-sm text-gray-500">Size: {item.size}</p>
                <div className="flex flex-wrap gap-2 text-xs text-gray-600 mt-1">
                  {Object.entries(item.measurements).map(([key, value]) => (
                    <span key={key} className="bg-gray-100 px-2 py-1 rounded">
                      {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                    </span>
                  ))}
                </div>
                <p className="text-md text-gray-500 flex items-center gap-1 mt-2">
                  Price: {currency}
                  {product.price}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <label htmlFor={`qty-${idx}`}>Qty:</label>
                  <input
                    id={`qty-${idx}`}
                    type="number"
                    min={1}
                    value={item.quantity}
                    onChange={(e) => {
                      const qty = Math.max(1, Number(e.target.value));
                      updateQuantity(
                        item._id,
                        item.size,
                        item.measurements,
                        qty
                      );
                    }}
                    className="w-16 border rounded px-2 py-1"
                  />
                </div>
              </div>
              <div className="font-semibold flex items-center gap-1 mt-2 md:mt-0">
                {currency}
                {product.price * item.quantity}
              </div>

              <img
                onClick={() =>
                  updateQuantity(item._id, item.size, item.measurements, 0)
                }
                src={assets.bin_icon}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                alt=""
              />
            </div>
          );
        })}
      </div>
      <div className="mt-10 flex flex-col justify-end items-end">
        <div className="text-lg w-2/3 sm:w-1/3 font-semibold">
          <CartTotal />
        </div>
        <button
          onClick={() => navigate("/place-order")}
          className="mt-4 bg-red-800 text-white px-6 py-2 rounded hover:bg-red-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
