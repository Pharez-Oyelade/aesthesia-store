// import React, { useContext, useEffect, useState } from "react";
// import { shopContext } from "../context/ShopContext";
// import Title from "../components/Title";
// import { assets } from "../assets/assets";
// // import CartTotal from "../components/CartTotal";

// const Cart = () => {
//   const { products, currency, cartItems, updateQuantity, navigate } =
//     useContext(shopContext);

//   const [cartData, setCartData] = useState([]);

//   useEffect(() => {
//     const tempData = [];
//     for (const items in cartItems) {
//       for (const item in cartItems[items]) {
//         if (cartItems[items][item] > 0) {
//           tempData.push({
//             _id: items,
//             size: item,
//             quantity: cartItems[items][item],
//           });
//         }
//       }
//     }
//     setCartData(tempData);
//   }, [cartItems]);

//   return (
//     <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] mt-20 pt-10">
//       <div className="border-t pt-14">
//         <div className="text-2xl mb-3">
//           <Title text1={"YOUR"} text2={"CART"} />
//         </div>

//         <div>
//           {cartData.map((item, index) => {
//             const productData = products.find(
//               (product) => product._id === item._id
//             );

//             return (
//               <div
//                 key={index}
//                 className="py-4 border-t border-b text-gray-700 grid grid-cols-[4fr_0.5fr_0.5fr] sm:grid-cols-[4fr_2fr_0.5fr] items-center gap-4"
//               >
//                 <div className="flex items-start gap-6">
//                   <img
//                     src={productData.image[0]}
//                     className="w-16 sm:w-20"
//                     alt=""
//                   />
//                   <div>
//                     <p className="text-xs sm:text-lg font-medium">
//                       {productData.name}
//                     </p>
//                     <div className="flex items-center gap-5 mt-2">
//                       <p>
//                         {currency}
//                         {productData.price}
//                       </p>
//                       <p className="px-2 sm:px-3 sm:py-1 border bg-slate-50 rounded-md">
//                         {item.size}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//                 <input
//                   onChange={(e) =>
//                     e.target.value === "" || e.target.value === "0"
//                       ? null
//                       : updateQuantity(
//                           item._id,
//                           item.size,
//                           Number(e.target.value)
//                         )
//                   }
//                   className="border max-w-10 sm:max-w-20 px-1 sm:px-2 py-1"
//                   type="number"
//                   min={1}
//                   defaultValue={item.quantity}
//                 />
//                 <img
//                   onClick={() => updateQuantity(item._id, item.size, 0)}
//                   src={assets.bin_icon}
//                   className="w-4 mr-4 sm:w-5 cursor-pointer"
//                   alt=""
//                 />
//               </div>
//             );
//           })}
//         </div>

//         <div className="flex justify-end my-20">
//           <div className="w-full sm:w-[450px]">
//             {/* <CartTotal /> */}
//             <div className="w-full text-end">
//               <button
//                 onClick={() => navigate("/place-order")}
//                 className="bg-black text-white text-sm my-8 px-8 py-3"
//               >
//                 PROCEED TO CHECKOUT
//               </button>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Cart;

import React, { useContext } from "react";
import { shopContext } from "../context/ShopContext";
import { Link } from "react-router-dom";
import CartTotal from "../components/CartTotal";

const Cart = () => {
  const { cartItems, products, currency, updateQuantity } =
    useContext(shopContext);

  // Flatten cartItems into an array for rendering
  const cartData = [];
  for (const itemId in cartItems) {
    for (const size in cartItems[itemId]) {
      if (cartItems[itemId][size] > 0) {
        cartData.push({
          _id: itemId,
          size,
          quantity: cartItems[itemId][size],
        });
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
              key={item._id + item.size}
              className="flex items-center gap-6 border-b pb-4"
            >
              <img
                src={product.image[0]}
                alt={product.name}
                className="w-24 h-24 object-cover rounded"
              />
              <div className="flex-1">
                <h3 className="font-medium">{product.name}</h3>
                <p className="text-sm text-gray-500">Size: {item.size}</p>
                <p className="text-md text-gray-500 flex items-center gap-1">
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
                      updateQuantity(item._id, item.size, qty);
                    }}
                    className="w-16 border rounded px-2 py-1"
                  />
                </div>
              </div>
              <div className="font-semibold flex items-center gap-1">
                {currency}
                {product.price * item.quantity}
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-10 flex flex-col justify-end items-end">
        <div className="text-lg w-1/3  font-semibold">
          {/* {total} */}
          <CartTotal />
        </div>
        <button className="mt-4 bg-red-800 text-white px-6 py-2 rounded hover:bg-red-700">
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
