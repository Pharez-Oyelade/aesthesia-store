import React, { useContext } from "react";
import { shopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = ({ discountAmount = 0 }) => {
  const {
    currency,
    delivery_fee,
    getCartAmount,
    formatPrice,
    convertPrice,
    getShippingCost,
    isInternational,
    getPlusSizeFee,
    PLUS_SIZE_FEE,
  } = useContext(shopContext);

  const plusSizeFee = getPlusSizeFee();
  const subtotal = getCartAmount() + getShippingCost() + plusSizeFee;
  const finalTotal = subtotal - discountAmount;

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
          <p>Shipping Fee {isInternational ? "(international)" : "(local)"}</p>
          <p>
            {currency}
            {/* {convertPrice(delivery_fee)} */}
            {convertPrice(getShippingCost())}
          </p>
        </div>
        <hr />

        {/* Plus Size Fee - Only show if applicable */}
        {plusSizeFee > 0 && (
          <>
            <div className="flex justify-between">
              <p className="flex items-center gap-1">
                Plus Size Fee (Size 18+)
                <span className="text-xs text-gray-500">
                  ({currency}
                  {convertPrice(PLUS_SIZE_FEE)} per item)
                </span>
              </p>
              <p>
                {currency}
                {convertPrice(plusSizeFee)}
              </p>
            </div>
            <hr />
          </>
        )}

        {/* Discount - Show if applied */}
        {discountAmount > 0 && (
          <>
            <div className="flex justify-between text-green-600">
              <p className="font-medium">Discount</p>
              <p className="font-medium">
                -{currency}
                {convertPrice(discountAmount)}
              </p>
            </div>
            <hr />
          </>
        )}

        {/* <div className="flex justify-between">
          <p>VAT 7.5%</p>
          <p>{formatPrice(getVAT())}</p>
        </div>
        <hr /> */}
        <div className="flex justify-between">
          <b>Total</b>
          <b>
            {currency}
            {convertPrice(getCartAmount() === 0 ? 0 : finalTotal)}
          </b>
        </div>
      </div>
    </div>
  );
};

export default CartTotal;
