import React, { useContext } from "react";
import { shopContext } from "../context/ShopContext";
import Title from "./Title";

const CartTotal = ({ discountAmount = 0, isDeliveryFree = false }) => {
  const {
    currency,
    delivery_fee,
    getCartAmount,
    formatPrice,
    convertPrice,
    getShippingCost,
    isInternational,
    getPlusSizeFee,
    getCustomColorFee,
    PLUS_SIZE_FEE,
    CUSTOM_COLOR_FEE,
  } = useContext(shopContext);

  const plusSizeFee = getPlusSizeFee();
  const customColorFee = getCustomColorFee();
  const effectiveShipping = isDeliveryFree ? 0 : getShippingCost();
  const subtotal =
    getCartAmount() + effectiveShipping + plusSizeFee + customColorFee;
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
          {isDeliveryFree ? (
            <p className="text-green-600 font-medium">Free</p>
          ) : (
            <p>
              {currency}
              {convertPrice(getShippingCost())}
            </p>
          )}
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

        {/* Custom Color Fee - Only show if applicable */}
        {customColorFee > 0 && (
          <>
            <div className="flex justify-between">
              <p className="flex items-center gap-1">
                Custom Color Fee
                <span className="text-xs text-gray-500">
                  ({currency}
                  {convertPrice(CUSTOM_COLOR_FEE)} per item)
                </span>
              </p>
              <p>
                {currency}
                {convertPrice(customColorFee)}
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
