import React, { useContext } from "react";
import { shopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = () => {
  const { currency, delivery_fee, getCartAmount, formatPrice, convertPrice } =
    useContext(shopContext);

  return (
    <div className="w-full">
      <div className="text-2xl">
        <Title text1={"CART"} text2={"TOTALS"} />
      </div>

      <div className="flex flex-col gap-2 mt-2 text-sm">
        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>
            {currency}
            {convertPrice(getCartAmount())}
          </p>
        </div>
        <hr />
        <div className="flex justify-between">
          <p>Shipping Fee</p>
          <p>
            {currency}
            {convertPrice(delivery_fee)}
          </p>
        </div>
        <hr />
        {/* <div className="flex justify-between">
          <p>VAT 7.5%</p>
          <p>{formatPrice(getVAT())}</p>
        </div>
        <hr /> */}
        <div className="flex justify-between">
          <b>Total</b>
          <b>
            {currency}
            {convertPrice(
              getCartAmount() === 0 ? 0 : getCartAmount() + delivery_fee
            )}
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
