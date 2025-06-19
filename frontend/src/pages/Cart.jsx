import React, { useContext, useState } from "react";
import { shopContext } from "../context/ShopContext";

const Cart = () => {
  const { products, currency, cartItems, updateQuantity, navigate } =
    useContext(shopContext);

  const [cartData, setCartData] = useState([]);

  useEffect(() => {
    const tempData = [];
    for (const items in cartItems) {
      for (const item in cartItems[items]) {
        if (cartItems[items][item] > 0) {
          tempData.push({
            _id: items,
            size: item,
            quantity: cartItems[items][item],
          });
        }
      }
    }
    setCartData(tempData);
  }, [cartItems]);

  return <div>Cart</div>;
};

export default Cart;
