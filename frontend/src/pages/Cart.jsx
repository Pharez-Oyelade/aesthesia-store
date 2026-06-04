import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { shopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import CartTotal from "../components/CartTotal";
import { trackInitiateCheckout } from "../utils/metaPixel";

// parse measurements key
const parseMeasurements = (mKey) => {
  try {
    return JSON.parse(mKey);
  } catch {
    return {};
  }
};

const Cart = () => {
  const {
    token,
    cartItems,
    products,
    currency,
    updateQuantity,
    navigate,
    formatPrice,
    convertPrice,
    PLUS_SIZE_FEE,
    CUSTOM_COLOR_FEE,
    CUSTOM_COLOR_NOTE_KEY,
    isPlusSize,
    isCustomColor,
  } = useContext(shopContext);

  // Tracking selected image for each cart item
  const [selectedImages, setSelectedImages] = useState({});

  // Flatten cartItems into an array
  const cartData = [];
  for (const itemId in cartItems) {
    for (const size in cartItems[itemId]) {
      for (const colorKey in cartItems[itemId][size]) {
        for (const mKey in cartItems[itemId][size][colorKey]) {
          if (cartItems[itemId][size][colorKey][mKey] > 0) {
            const cartMeasurements = parseMeasurements(mKey);
            const {
              [CUSTOM_COLOR_NOTE_KEY]: customColorNote,
              note,
              ...measurements
            } = cartMeasurements;
            cartData.push({
              _id: itemId,
              size,
              color: colorKey === "no-color" ? "" : colorKey,
              measurements,
              cartMeasurements,
              customColorNote: customColorNote || note || "",
              quantity: cartItems[itemId][size][colorKey][mKey],
              mKey,
            });
          }
        }
      }
    }
  }

  const handleImageSelect = (cartKey, imgUrl) => {
    setSelectedImages((prev) => ({ ...prev, [cartKey]: imgUrl }));
  };

  const handleCheckout = () => {
    trackInitiateCheckout(cartData, products);
    navigate("/place-order");
  };

  if (cartData.length === 0) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <Link to="/collection" className="text-red-600 underline">
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
          const cartKey = item._id + item.size + item.color + item.mKey;
          const mainImage = selectedImages[cartKey] || product.image[0].url;
          const basePrice = product.onSale ? product.salePrice : product.price;
          const plusSizeFee = isPlusSize(item.size) ? PLUS_SIZE_FEE : 0;
          const customColorFee = isCustomColor(item.color)
            ? CUSTOM_COLOR_FEE
            : 0;
          const itemTotal =
            (basePrice + plusSizeFee + customColorFee) * item.quantity;
          return (
            <div
              key={cartKey}
              className="flex flex-col md:flex-row items-start md:items-center gap-6 border-b pb-4"
            >
              <div className="flex flex-col items-center gap-2">
                <img
                  src={mainImage}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-lg">{product.name}</h3>
                <p className="text-sm text-gray-500">Size: {item.size}</p>
                {item.color && (
                  <p className="text-sm text-gray-500">
                    Color: {item.color}
                  </p>
                )}
                {item.customColorNote && (
                  <p className="text-sm text-gray-500">
                    Custom color note: {item.customColorNote}
                  </p>
                )}
                <div className="flex flex-wrap gap-2 text-xs text-gray-600 mt-1">
                  {Object.entries(item.measurements)
                    .filter(([, value]) => value)
                    .map(([key, value]) => (
                      <span key={key} className="bg-gray-100 px-2 py-1 rounded">
                        {key.charAt(0).toUpperCase() + key.slice(1)}: {value}
                      </span>
                    ))}
                </div>
                <p className="text-md text-gray-500 flex items-center gap-1 mt-2">
                  Price: {formatPrice(itemTotal)}
                </p>
                {(plusSizeFee > 0 || customColorFee > 0) && (
                  <div className="mt-1 space-y-1 text-xs text-gray-500">
                    {plusSizeFee > 0 && (
                      <p>
                        Includes plus size fee: {formatPrice(plusSizeFee)} per
                        item
                      </p>
                    )}
                    {customColorFee > 0 && (
                      <p>
                        Includes custom color fee:{" "}
                        {formatPrice(customColorFee)} per item
                      </p>
                    )}
                  </div>
                )}
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
                        item.color,
                        item.cartMeasurements,
                        qty,
                      );
                    }}
                    className="w-16 border rounded px-2 py-1"
                  />
                </div>
              </div>
              <div className="font-semibold flex items-center gap-1 mt-2 md:mt-0">
                {/* {product.price * item.quantity} */}
                {currency}
                {convertPrice(itemTotal)}
              </div>

              <img
                onClick={() =>
                  updateQuantity(
                    item._id,
                    item.size,
                    item.color,
                    item.cartMeasurements,
                    0,
                  )
                }
                src={assets.bin_icon}
                className="w-4 mr-4 sm:w-5 cursor-pointer"
                alt=""
              />
            </div>
          );
        })}

        {/* Card to nudge creating an account */}
        {!token && (
          <div className="p-4 border rounded bg-yellow-50 text-center">
            <p className="mb-2">
              Create an account to save your cart and access it from any device!
            </p>
            <button
              onClick={() => navigate("/login")}
              className="bg-red-800 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Login / Sign Up
            </button>
          </div>
        )}
      </div>
      <div className="mt-10 flex flex-col justify-end items-end">
        <div className="text-lg w-2/3 sm:w-1/3 font-semibold">
          <CartTotal />
        </div>
        <button
          onClick={handleCheckout}
          className="mt-4 bg-red-800 text-white px-6 py-2 rounded hover:bg-red-700"
        >
          Proceed to Checkout
        </button>
        <p>
          Check our{" "}
          <Link to="/shipping-policy" className="text-red-600 underline">
            shipping policy
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Cart;
