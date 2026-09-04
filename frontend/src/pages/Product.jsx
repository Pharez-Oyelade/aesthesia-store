import React, { useContext, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useParams } from "react-router-dom";
import { shopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { trackAddToCart, trackViewContent } from "../utils/metaPixel";
import {
  trackAddToCart as trackAddToCartTT,
  trackViewContent as trackViewContentTT,
} from "../utils/tiktokPixel";
import { getOptimizedUrl } from "../utils/cloudinaryHelper";
import { productReviews } from "../../data/productReview";
import ProductReview from "../components/ProductReview";

// import { RxCaretLeft } from "react-icons/rx";
// import { RxCaretRight } from "react-icons/rx";
// import { IoMdClose } from "react-icons/io";

const Product = () => {
  const { productId, id } = useParams();
  const {
    products,
    currency,
    addToCart,
    wishlist,
    addToWishlist,
    formatPrice,
    convertPrice,
    token,
    navigate,
    PLUS_SIZE_FEE,
    PLUS_SIZE_THRESHOLD,
    CUSTOM_COLOR_FEE,
    CUSTOM_COLOR_OPTION,
  } = useContext(shopContext);

  // Find product after products are loaded
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [length, setLength] = useState("");
  const [fitLength, setFitLength] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [measurements, setMeasurements] = useState({
    waist: "",
    length: "",
    hips: "",
    bust: "",
    sleeveLength: "",
  });
  const trackedProductId = useRef(null);
  const [displayedReviews, setDisplayedReviews] = useState([]);

  const [activeTab, setActiveTab] = useState("description");

  const [isCustom, setIsCustom] = useState(false);
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState("");

  // Show the note field only while the custom color option is selected.
  useEffect(() => {
    const selectedCustomColor =
      color.toLowerCase() === CUSTOM_COLOR_OPTION.toLowerCase();
    setIsCustom(selectedCustomColor);

    if (!selectedCustomColor) {
      setNote("");
    }
  }, [color, CUSTOM_COLOR_OPTION]);

  // const [isImageModal, setIsImageModal] = useState(false);
  // const [modalIndex, setModalIndex] = useState(0);

  // useEffect(() => {
  //   const handleEsc = (e) => e.key === "Escape" && setIsImageModal(false);
  //   window.addEventListener("keydown", handleEsc);
  //   return () => window.removeEventListener("keydown", handleEsc);
  // }, []);

  const tabs = [
    {
      id: "description",
      label: "Description",
    },
    { id: "story", label: "Story" },
    { id: "size-guide", label: "Size Guide" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div>
            <p className="font-bold">{productData.name}</p>
            <p>{productData.tagline}</p>
            <p className="mb-10 whitespace-pre-wrap">
              {productData.description}
            </p>
            <p>{productData.specificDetails}</p>
          </div>
        );
      case "story":
        return <p>{productData.story}</p>;
      case "size-guide":
        return <img src={assets.size_chart} className="w-150 mx-auto" alt="" />;
      default:
        return null;
    }
  };

  const charLimit = 250;

  const isPlusSize = (size) => {
    const numericSize = parseInt(size);
    return !isNaN(numericSize) && numericSize >= PLUS_SIZE_THRESHOLD;
  };

  // Find product when products or params change
  useEffect(() => {
    if (products && products.length > 0) {
      const prod = products.find((item) => item._id === (productId || id));
      setProductData(prod || null);
      setImage(
        prod && prod.image && prod.image[0].url ? prod.image[0].url : "",
      );
      setSize("");
      setColor("");
      setLength("");
      setFitLength("");
      setQuantity(1);
      setFormError("");
    }
  }, [products, productId, id]);

  useEffect(() => {
    if (!productData || trackedProductId.current === productData._id) return;

    trackViewContent(productData);
    trackViewContentTT(productData);
    trackedProductId.current = productData._id;
  }, [productData]);

  // Handle measurement input
  const handleMeasurementChange = (e) => {
    setMeasurements({ ...measurements, [e.target.name]: e.target.value });
  };

  // Only require measurements for clothing
  const requiresMeasurements =
    // (productData && productData.section === "The RERE Collection") ||
    // (productData && productData.section === "The Color Code Collection") ||
    // (productData && productData.section === "Unfold") ||
    // (productData && productData.section === "The Haven");
    productData && productData.section !== "Still Her";
  const availableSizes =
    productData && productData.sizes
      ? productData.sizes.slice().sort((a, b) => Number(a) - Number(b))
      : [];
  const availableColors =
    productData && productData.colors ? productData.colors : [];

  // Add to cart handler
  const handleAddToCart = (e) => {
    e.preventDefault();
    setFormError("");

    // if (!token) {
    //   navigate("/login");
    //   return;
    // }
    if (availableSizes.length > 0 && !size) {
      setFormError("Please select a size");
      return;
    }
    if (availableColors.length > 0 && !color) {
      setFormError("Please select a color");
      return;
    }
    if (
      productData.fitLength &&
      productData.fitLength.length > 0 &&
      !fitLength
    ) {
      setFormError("Please select a length");
      return;
    }
    if (color === CUSTOM_COLOR_OPTION && !note.trim()) {
      setFormError("Please enter a custom color");
      return;
    }
    // if (productData.length && productData.length.length > 0 && !length) {
    //   setFormError("Please select a length");
    //   return;
    // }
    // if (requiresMeasurements && Object.values(measurements).some((v) => !v)) {
    //   setFormError("Please fill all measurements");
    //   return;
    // }
    addToCart(
      productData._id,
      size,
      color,
      { ...measurements, fitLength },
      quantity,
      note,
    );
    trackAddToCart(productData, quantity, {
      size,
      color,
      fitLength,
    });
    trackAddToCartTT(productData, quantity);

    navigate("/cart");
  };

  // show reviews for this product only
  // const displayedReviews = productReviews.filter(
  //   (review) =>
  //     (review.product === productData && productData.name) ||
  //     (review.product === productData && productData.section),
  // );
  useEffect(() => {
    if (productData) {
      const filtered = productReviews.filter((review) => {
        return (
          review.product === productData.name ||
          review.product === productData.section
        );
      });

      setDisplayedReviews(filtered);
    }
  }, [productData]);

  // Loading state
  if (!products || products.length === 0) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  if (!productData) {
    return <div className="p-8 text-center">Product not found.</div>;
  }

  return (
    <div>
      <div className="min-h-screen py-6 md:py-10">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl px-4 py-5 md:p-12">
          <div className=" flex flex-col md:flex-row gap-12">
            {/* Product Images */}
            <div className="flex-1 flex flex-col gap-6">
              <div className="w-full aspect-square bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden shadow-md">
                <img
                  src={getOptimizedUrl(image, 800)}
                  className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
                  alt={productData.name}
                />
              </div>
              <div className="flex flex-wrap gap-3 justify-center mt-2">
                {productData.image.map((item, index) => (
                  <img
                    onClick={() => setImage(item?.url)}
                    loading="lazy"
                    src={getOptimizedUrl(item.url, 400)}
                    key={index}
                    className={`w-16 h-16 object-cover rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                      image === item.url
                        ? "border-red-600 scale-105"
                        : "border-gray-200"
                    }`}
                    alt={productData.name + " thumbnail"}
                  />
                ))}
              </div>
            </div>
            {/* Product Details */}
            <div className="flex-1 flex flex-col gap-6 justify-between md:sticky md:top-24 md:self-start md:h-fit">
              <div>
                <h1 className="font-bold text-3xl md:text-4xl text-gray-900 mb-2">
                  {productData.name}
                </h1>

                {/* Social Proof Reviews Anchor */}
                {displayedReviews.length > 0 && (
                  <a
                    href="#reviews-section"
                    className="flex items-center gap-2 mb-4 cursor-pointer hover:underline text-sm text-gray-600"
                  >
                    <div className="flex text-yellow-400">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ))}
                    </div>
                    <span>({displayedReviews.length} Reviews)</span>
                  </a>
                )}

                {/* Preorder Tag */}
                {productData.preorder && !productData.soldOut && (
                  <div className="mb-4">
                    <span className="bg-yellow-400 text-yellow-900 text-sm font-bold px-3 py-1 rounded-full shadow">
                      Preorder
                    </span>
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-800">
                        <strong>Preorder Notice:</strong> This item is available
                        for preorder. Your order will be processed and shipped
                        once the item becomes available.
                      </p>
                    </div>
                  </div>
                )}
                {/* Sold Out Tag */}
                {productData.soldOut && (
                  <div className="mb-4">
                    <span className="bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow">
                      Sold Out
                    </span>
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">
                        <strong>Sold Out:</strong> This product is currently out
                        of stock and cannot be ordered.
                      </p>
                    </div>
                  </div>
                )}

                <p className="text-sm w-3/4 italic text-gray-700 pb-2">
                  {productData.tagline}
                </p>

                {/* <p className="text-2xl font-semibold text-red-700 flex items-center mb-4">
              {currency}
              {productData.price}
            </p> */}

                <div className="text-2xl font-semibold text-red-700 flex items-center mb-4">
                  {productData.onSale ? (
                    <p className="flex flex-wrap items-center">
                      <span className="flex items-center line-through text-gray-400 mr-3">
                        {currency}
                        {convertPrice(productData.price)}
                      </span>
                      <span className="flex items-center text-red-600">
                        {currency}
                        {convertPrice(productData.salePrice)}
                      </span>
                      <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                        Sale
                      </span>
                    </p>
                  ) : (
                    <div className="flex items-center">
                      {currency}
                      {convertPrice(productData.price)}
                    </div>
                  )}
                </div>
                <p className="text-gray-600 mb-6 leading-relaxed text-xl">
                  {/* {productData.description} */}
                  {productData.description.length > charLimit
                    ? productData.description.substring(0, charLimit) + "..."
                    : productData.description}
                  {productData.description.length > charLimit && (
                    <a
                      href="#description"
                      className="cursor-pointer underline text-sm text-blue-600"
                    >
                      Full description
                    </a>
                  )}
                </p>

                {/* <p className="mb-5 font-medium">
                  Petit - 5'5, 5'6, 5'7 <br />
                  Regular - 5'8, 5'9, 5'10 <br />
                  Tall - 5'11
                </p> */}

                {requiresMeasurements && (
                  <div className="space-y-5 mb-5">
                    <div>
                      <p className="font-bold">Petite</p>
                      <p>
                        For women{" "}
                        <span className="font-semibold">5'0"-5'5"</span>
                      </p>
                    </div>

                    <div>
                      <p className="font-bold">Regular</p>
                      <p>
                        For women{" "}
                        <span className="font-semibold">5'6"-5'8"</span>
                      </p>
                    </div>

                    <div>
                      <p className="font-bold">Tall</p>
                      <p>
                        For women{" "}
                        <span className="font-semibold">5'9"-5'11"</span>
                      </p>
                    </div>
                  </div>
                )}

                <p className="mb-5 font-semibold">
                  {productData.specificDetails}
                </p>
                {productData.sizes && productData.sizes.length > 0 && (
                  <div>
                    {availableSizes.length > 0 && (
                      <div className="mb-6">
                        <p className="font-medium mb-2">Select Size</p>
                        <div className="flex gap-3 flex-wrap">
                          {availableSizes.map((item, index) => (
                            <button
                              onClick={() => setSize(item)}
                              key={index}
                              required
                              className={`px-5 py-2 rounded-lg border-2 transition-all duration-200 font-semibold text-gray-700 focus:outline-none ${
                                item === size
                                  ? "border-red-600 bg-red-50 text-red-700"
                                  : "border-gray-300 bg-white hover:bg-gray-100"
                              }`}
                            >
                              {item}
                            </button>
                          ))}
                        </div>
                        <p className="text-sm text-gray-500">
                          *Click to Reference{" "}
                          <span className="text-[#691110] underline">
                            <a
                              onClick={() => setActiveTab("size-guide")}
                              href="#description"
                            >
                              Size guide
                            </a>
                          </span>
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* .........  PLUS SIZE DISCLAIMER ......... */}
                {availableSizes.length > 0 && size && isPlusSize(size) && (
                  <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-sm text-blue-800">
                      <strong>Plus Size Notice:</strong> An additional fee of{" "}
                      {currency}
                      {convertPrice(PLUS_SIZE_FEE)} applies to size {size}.
                    </p>
                  </div>
                )}

                {availableColors.length > 0 && (
                  <div className="mb-6">
                    <p className="font-medium mb-2">Select Color</p>
                    <div className="flex gap-3 flex-wrap">
                      {availableColors.map((item, index) => (
                        <button
                          onClick={() => setColor(item)}
                          key={index}
                          required
                          className={`px-5 py-2 rounded-lg border-2 transition-all duration-200 font-semibold text-gray-700 focus:outline-none ${
                            item === color
                              ? "border-red-600 bg-red-50 text-red-700"
                              : "border-gray-300 bg-white hover:bg-gray-100"
                          } ${item === CUSTOM_COLOR_OPTION ? "italic border-[#691110]" : ""}`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Custom color note if custom color */}
                {isCustom && (
                  <div className="">
                    <label htmlFor="custom-color-note">Custom Color</label>
                    <p className="mb-2 text-sm text-gray-600">
                      Custom color attracts an additional fee of {currency}
                      {convertPrice(CUSTOM_COLOR_FEE)}.
                    </p>
                    <input
                      type="text"
                      name="customColorNote"
                      id="custom-color-note"
                      placeholder="In what stunning color do you want your piece?"
                      className="px-5 py-2 rounded-lg border-2 transition-all duration-200 font-semibold text-gray-700 focus:outline-none border-gray-300 w-full mb-8"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    ></input>
                  </div>
                )}

                {/* Length Selection*/}

                {/* <div className="mb-6">
                    <p className="font-medium mb-2">Select Fit Length</p>
                    <div className="flex gap-3 flex-wrap">
                      {["petite", "Regular", "Tall"].map((item, index) => (
                        <button
                          onClick={() => setFitLength(item)}
                          key={index}
                          className={`px-5 py-2 rounded-lg border-2 transition-all duration-200 font-semibold text-gray-700 focus:outline-none ${
                            item === fitLength
                              ? "border-red-600 bg-red-50 text-red-700"
                              : "border-gray-300 bg-white hover:bg-gray-100"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div> */}

                {productData.fitLength && productData.fitLength.length > 0 && (
                  <div className="mb-6">
                    <p className="font-medium mb-2">Select Length</p>
                    <div className="flex gap-3 flex-wrap">
                      {productData.fitLength.map((item, index) => (
                        <button
                          onClick={() => setFitLength(item)}
                          key={index}
                          className={`px-5 py-2 rounded-lg border-2 transition-all duration-200 font-semibold text-gray-700 focus:outline-none ${
                            item === fitLength
                              ? "border-red-600 bg-red-50 text-red-700"
                              : "border-gray-300 bg-white hover:bg-gray-100"
                          }`}
                        >
                          {item}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                {requiresMeasurements && (
                  <div className="mt-4 p-4 border-l-4 border-red-600 bg-red-50 dark:bg-red-900 text-red-800 dark:text-red-100 rounded-md text-sm">
                    <h4 className="font-semibold mb-1">
                      Size Selection and Custom Fit Disclaimer
                    </h4>
                    <p className="mb-1">
                      Please Select your preferred size from the available
                      options. You may also provide your{" "}
                      <span className="font-medium">
                        exact body measurements
                      </span>{" "}
                      for a more tailored fit.{" "}
                    </p>
                    <p className="mb-1">
                      If you{" "}
                      <span className="font-semibold">
                        do not enter your measurements
                      </span>{" "}
                      , your order will be processed using our{" "}
                      <span className="font-semibold">standard sizing </span>
                      based on the size you selected.
                    </p>{" "}
                    <p>
                      Need help choosing a size?{" "}
                      <a
                        onClick={() => setActiveTab("size-guide")}
                        href="#size-guide"
                        className="underline font-medium text-blue-600 hover:text-blue-800"
                      >
                        View our Size Guide
                      </a>
                    </p>
                  </div>
                )}

                {/* Measurements Form */}
                {requiresMeasurements && (
                  <form
                    onSubmit={handleAddToCart}
                    className="flex flex-col gap-4 mt-4"
                  >
                    <p className="font-bold">
                      Measurements for fitting(optional)
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <input
                        type="number"
                        name="waist"
                        value={measurements.waist}
                        onChange={handleMeasurementChange}
                        placeholder="Waist (inches)"
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-200"
                        min={0}
                      />
                      <input
                        type="number"
                        name="length"
                        value={measurements.length}
                        onChange={handleMeasurementChange}
                        placeholder="Length (inches)"
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-200"
                        min={0}
                      />
                      <input
                        type="number"
                        name="hips"
                        value={measurements.hips}
                        onChange={handleMeasurementChange}
                        placeholder="Hips (inches)"
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-200"
                        min={0}
                      />
                      <input
                        type="number"
                        name="bust"
                        value={measurements.bust}
                        onChange={handleMeasurementChange}
                        placeholder="Bust (inches)"
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-200"
                        min={0}
                      />
                      <input
                        type="number"
                        name="sleeveLength"
                        value={measurements.sleeveLength}
                        onChange={handleMeasurementChange}
                        placeholder="Sleeve Length(inches)"
                        className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-200"
                        min={0}
                      />
                    </div>
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-4 mt-2">
                      <span className="font-medium">Quantity:</span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded-full bg-gray-200 text-xl font-bold flex items-center justify-center hover:bg-red-100"
                      >
                        -
                      </button>
                      <span className="text-lg font-semibold w-8 text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 text-xl font-bold flex items-center justify-center hover:bg-red-100"
                      >
                        +
                      </button>
                    </div>
                    <div className="fixed md:static bottom-0 left-0 w-full bg-white md:bg-transparent p-4 md:p-0 border-t md:border-none border-gray-200 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.1)] md:shadow-none z-50 mt-4 flex flex-col gap-2">
                      {formError && (
                        <div className="flex items-center justify-center md:justify-start gap-1.5 text-red-600 font-semibold text-sm animate-pulse">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          <p>{formError}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-3 justify-center md:justify-start w-full">
                        <button
                          onClick={handleAddToCart}
                          className="flex-1 md:flex-none w-full md:w-auto bg-gradient-to-r from-[#691110] to-red-700 hover:from-red-800 hover:to-red-600 text-white px-8 py-3.5 md:py-3 rounded-xl text-lg font-bold shadow-lg transition-all duration-200 active:scale-95"
                          disabled={productData.soldOut}
                        >
                          {`${
                            productData.soldOut
                              ? "Sold Out"
                              : productData.preorder
                                ? "Preorder Now"
                                : "Add to Cart"
                          }`}
                        </button>
                        <button
                          type="button"
                          onClick={() => addToWishlist(productData._id)}
                          className={`p-3.5 md:p-3 rounded-xl border-2 transition-all flex items-center justify-center shrink-0 ${
                            wishlist && wishlist.includes(productData._id)
                              ? "border-red-600 bg-red-50 text-red-600"
                              : "border-gray-300 bg-white text-gray-500 hover:border-gray-400"
                          }`}
                          title="Add to Wishlist"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill={
                              wishlist && wishlist.includes(productData._id)
                                ? "currentColor"
                                : "none"
                            }
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </form>
                )}
                {/* If not clothing, show quantity and add to cart */}
                {!requiresMeasurements && (
                  <div>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="font-medium">Quantity:</span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        className="w-8 h-8 rounded-full bg-gray-200 text-xl font-bold flex items-center justify-center hover:bg-red-100"
                      >
                        -
                      </button>
                      <span className="text-lg font-semibold w-8 text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQuantity((q) => q + 1)}
                        className="w-8 h-8 rounded-full bg-gray-200 text-xl font-bold flex items-center justify-center hover:bg-red-100"
                      >
                        +
                      </button>
                    </div>
                    <div className="fixed md:static bottom-0 left-0 w-full bg-white md:bg-transparent p-4 md:p-0 border-t md:border-none border-gray-200 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.1)] md:shadow-none z-50 mt-4 flex flex-col gap-2">
                      {formError && (
                        <div className="flex items-center justify-center md:justify-start gap-1.5 text-red-600 font-semibold text-sm animate-pulse">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                            />
                          </svg>
                          <p>{formError}</p>
                        </div>
                      )}
                      <div className="flex items-center gap-3 justify-center md:justify-start w-full">
                        <button
                          onClick={handleAddToCart}
                          className="flex-1 md:flex-none w-full md:w-auto bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 hover:to-red-600 text-white px-8 py-3.5 md:py-3 rounded-xl text-lg font-bold shadow-lg transition-all duration-200 active:scale-95"
                          disabled={productData.soldOut}
                        >
                          {`${
                            productData.soldOut
                              ? "Sold Out"
                              : productData.preorder
                                ? "Preorder Now"
                                : "Add to Cart"
                          }`}
                        </button>
                        <button
                          type="button"
                          onClick={() => addToWishlist(productData._id)}
                          className={`p-3.5 md:p-3 rounded-xl border-2 transition-all flex items-center justify-center shrink-0 ${
                            wishlist && wishlist.includes(productData._id)
                              ? "border-red-600 bg-red-50 text-red-600"
                              : "border-gray-300 bg-white text-gray-500 hover:border-gray-400"
                          }`}
                          title="Add to Wishlist"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill={
                              wishlist && wishlist.includes(productData._id)
                                ? "currentColor"
                                : "none"
                            }
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className="w-6 h-6"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="border-t pt-6 mt-6 text-sm text-gray-600 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5 text-green-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                      />
                    </svg>
                  </div>
                  <p className="font-medium">100% Original Product</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5 text-blue-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  </div>
                  <p className="font-medium">Secure Online Payment</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-orange-50 p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      className="w-5 h-5 text-orange-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <p className="font-medium">
                    {productData.section !== "Still Her"
                      ? "7-10 working days production time"
                      : "Delivery in 3-5 working days"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center pt-10">
            Aesthesia- Where women see themselves again.
          </p>
        </div>

        {/* Description & Reviews */}
        <div
          id="description"
          className="max-w-6xl mx-auto mt-12 bg-white rounded-2xl shadow-lg p-8"
        >
          <div></div>
          <div className="flex gap-5 border-b pb-4 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`text-lg font-medium cursor-pointer ${
                  tab.id === activeTab ? "text-red-600" : "text-gray-600"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div
            className={`gap-4 text-gray-600 text-lg leading-relaxed`}
            id="size-guide"
          >
            <div>{renderTabContent()}</div>
          </div>
        </div>

        {/* Reviews */}
        <div
          id="reviews-section"
          className="max-w-6xl mx-auto px-4 mt-12 scroll-mt-24"
        >
          <ProductReview reviews={displayedReviews} />
        </div>

        {/* Related Products */}
        <div className="max-w-6xl mx-auto px-4 mt-12 pb-24 md:pb-0">
          <RelatedProducts section={productData.section} />
        </div>
      </div>
      {/* {isImageModal && (
        <div className="absolute w-full h-[100vh] top-0 left-0 bg-black/50 flex items-center justify-center">
          <div className="relative flex items-center justify-center">
            <button
              onClick={() =>
                setModalIndex((prev) =>
                  prev === 0 ? productData.image.length - 1 : prev - 1
                )
              }
              className="px-4 py-2 text-7xl font-bold cursor-pointer text-white"
            >
              <RxCaretLeft />
            </button>
            <img
              src={productData.image[modalIndex]?.url}
              alt="Product"
              className="max-w-4xl mt-20 h-[60%] w-[50%] object-contain"
              onClick={() => setIsImageModal(false)}
            />
            <button
              onClick={() =>
                setModalIndex((prev) =>
                  prev === productData.image.length - 1 ? 0 : prev + 1
                )
              }
              className=" px-4 py-2 text-7xl font-bold cursor-pointer text-white"
            >
              <RxCaretRight />
            </button>

            <button
              onClick={() => setIsImageModal(false)}
              className="absolute top-40 right-0 text-4xl cursor-pointer text-white"
            >
              <IoMdClose />
            </button>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default Product;
