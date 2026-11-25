import React, { useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion as Motion } from "framer-motion";
import { LuCheck, LuShoppingBag, LuX } from "react-icons/lu";
import { getOptimizedUrl } from "../utils/cloudinaryHelper";

const AddedToCartModal = ({
  summary,
  currency,
  convertPrice,
  onContinueShopping,
  onGoToCart,
}) => {
  const dialogRef = useRef(null);
  const goToCartBtnRef = useRef(null);
  const isOpen = Boolean(summary);

  useEffect(() => {
    if (!isOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const previouslyFocused = document.activeElement;
    document.body.style.overflow = "hidden";

    const focusTimer = window.requestAnimationFrame(() => {
      goToCartBtnRef.current?.focus();
    });

    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onContinueShopping();
        return;
      }

      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll(
          'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
        );
        if (focusables.length === 0) return;

        const first = focusables[0];
        const last = focusables[focusables.length - 1];

        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.cancelAnimationFrame(focusTimer);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused && previouslyFocused.isConnected) {
        previouslyFocused.focus?.();
      }
    };
  }, [isOpen, onContinueShopping]);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {summary && (
        <Motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Added to cart confirmation"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{
            opacity: 0,
            pointerEvents: "none",
            transition: { duration: 0.15 },
          }}
          transition={{ duration: 0.18 }}
          onClick={onContinueShopping}
          className="fixed inset-0 z-[950] bg-black/55 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4"
        >
          <Motion.div
            initial={{ y: 28, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0, transition: { duration: 0.15 } }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="w-full sm:max-w-md bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl p-6 sm:p-7"
          >
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className="flex items-center gap-2.5 text-green-700">
                <span className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <LuCheck className="w-4 h-4" />
                </span>
                <h2 className="text-lg font-bold text-gray-900">
                  {summary.preorder ? "Added Preorder to Bag" : "Added to Bag"}
                </h2>
              </div>
              <button
                type="button"
                onClick={onContinueShopping}
                aria-label="Close confirmation"
                className="p-1.5 rounded-full text-gray-500 hover:text-gray-800 hover:bg-gray-100 transition cursor-pointer"
              >
                <LuX className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-50 border border-gray-100 mb-6">
              {summary.imageUrl && (
                <img
                  src={getOptimizedUrl(summary.imageUrl, 240)}
                  alt={summary.name}
                  className="w-18 h-20 object-cover rounded-lg shrink-0"
                />
              )}
              <div className="min-w-0 flex-1 text-sm">
                <p className="font-semibold text-gray-900 truncate">
                  {summary.name}
                </p>
                <div className="text-gray-600 text-xs mt-1 space-y-0.5">
                  {summary.size && <p>Size: {summary.size}</p>}
                  {summary.color && (
                    <p>
                      Color: {summary.color}
                      {summary.note ? ` (${summary.note})` : ""}
                    </p>
                  )}
                  {summary.fitLength && <p>Length: {summary.fitLength}</p>}
                  <p>Qty: {summary.quantity}</p>
                </div>
                <p className="font-bold text-[#691110] mt-1.5">
                  {currency}
                  {convertPrice(summary.lineTotal)}
                </p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3">
              <button
                ref={goToCartBtnRef}
                type="button"
                onClick={onGoToCart}
                className="flex-1 inline-flex items-center justify-center gap-2 bg-gradient-to-r from-[#691110] to-red-700 hover:from-red-800 hover:to-red-600 text-white px-5 py-3 rounded-xl font-bold shadow-md transition cursor-pointer"
              >
                <LuShoppingBag className="w-4 h-4" />
                <span>View Cart & Checkout</span>
              </button>
              <button
                type="button"
                onClick={onContinueShopping}
                className="flex-1 px-5 py-3 rounded-xl border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-800 font-semibold transition cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </Motion.div>
        </Motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
};

export default AddedToCartModal;
