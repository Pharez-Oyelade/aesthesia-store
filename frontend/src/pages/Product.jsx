import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { shopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  const { productId, id } = useParams();
  const {
    products,
    currency,
    addToCart,
    wishlist,
    addToWishlist,
    formatPrice,
  } = useContext(shopContext);

  // Find product after products are loaded
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [measurements, setMeasurements] = useState({
    waist: "",
    length: "",
    hips: "",
    bust: "",
    sleeveLength: "",
  });

  const charLimit = 150;

  // Find product when products or params change
  useEffect(() => {
    if (products && products.length > 0) {
      const prod = products.find((item) => item._id === (productId || id));
      setProductData(prod || null);
      setImage(prod && prod.image && prod.image[0] ? prod.image[0] : "");
    }
  }, [products, productId, id]);

  // Handle measurement input
  const handleMeasurementChange = (e) => {
    setMeasurements({ ...measurements, [e.target.name]: e.target.value });
  };

  // Only require measurements for clothing
  const requiresMeasurements =
    (productData && productData.section === "clothes") ||
    (productData && productData.section === "rere-collection");
  const availableSizes =
    productData && productData.sizes
      ? productData.sizes.slice().sort((a, b) => Number(a) - Number(b))
      : [];

  // Add to cart handler
  const handleAddToCart = (e) => {
    e.preventDefault();
    if (availableSizes.length > 0 && !size) {
      alert("Please select a size");
      return;
    }
    // if (requiresMeasurements && Object.values(measurements).some((v) => !v)) {
    //   alert("Please fill all measurements");
    //   return;
    // }
    addToCart(
      productData._id,
      size,
      requiresMeasurements ? measurements : {},
      quantity
    );
  };

  // Loading state
  if (!products || products.length === 0) {
    return <div className="p-8 text-center">Loading...</div>;
  }
  if (!productData) {
    return <div className="p-8 text-center">Product not found.</div>;
  }

  return (
    <div className="bg-gradient-to-br from-white to-gray-100 min-h-screen py-10">
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row gap-12">
        {/* Product Images */}
        <div className="flex-1 flex flex-col gap-6">
          <div className="w-full aspect-square bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden shadow-md">
            <img
              src={image}
              className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
              alt={productData.name}
            />
          </div>
          <div className="flex gap-3 justify-center mt-2">
            {productData.image.map((item, index) => (
              <img
                onClick={() => setImage(item)}
                loading="lazy"
                src={item}
                key={index}
                className={`w-16 h-16 object-cover rounded-lg border-2 cursor-pointer transition-all duration-200 ${
                  image === item
                    ? "border-red-600 scale-105"
                    : "border-gray-200"
                }`}
                alt={productData.name + " thumbnail"}
              />
            ))}
          </div>
        </div>
        {/* Product Details */}
        <div className="flex-1 flex flex-col gap-6 justify-between">
          <div>
            <h1 className="font-bold text-3xl md:text-4xl text-gray-900 mb-2">
              {productData.name}
            </h1>
            {/* <p className="text-2xl font-semibold text-red-700 flex items-center mb-4">
              {currency}
              {productData.price}
            </p> */}

            <div className="text-2xl font-semibold text-red-700 flex items-center mb-4">
              {productData.onSale ? (
                <>
                  <span className="flex items-center line-through text-gray-400 mr-3">
                    {formatPrice(productData.price)}
                  </span>
                  <span className="flex items-center text-red-600">
                    {formatPrice(productData.salePrice)}
                  </span>
                  <span className="ml-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
                    Sale
                  </span>
                </>
              ) : (
                <div className="flex items-center">
                  {formatPrice(productData.price)}
                </div>
              )}
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
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
                        <a href="#size-guide">Size guide</a>
                      </span>
                    </p>
                  </div>
                )}
              </div>
            )}
            <div className="mt-4 p-4 border-l-4 border-yellow-500 bg-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 rounded-md text-sm">
              <h4 className="font-semibold mb-1">
                Size Selection and Custom Fit Disclaimer
              </h4>
              <p className="mb-1">
                Please Select your preferred size from the available options.
                You may also provide your{" "}
                <span className="font-medium">exact body measurements</span> for
                a more tailored fit.{" "}
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
                  href="#size-guide"
                  className="underline font-medium text-blue-600 hover:text-blue-800"
                >
                  View our Size Guide
                </a>
              </p>
            </div>
            {/* Measurements Form */}
            {requiresMeasurements && (
              <form
                onSubmit={handleAddToCart}
                className="flex flex-col gap-4 mt-4"
              >
                <p>Measurements for fitting</p>
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
                <button
                  type="submit"
                  className="w-full md:w-auto bg-gradient-to-r from-[#691110] to-red-700 hover:from-red-800 hover:to-red-600 text-white px-8 py-3 rounded-xl text-lg font-bold shadow-lg transition-all duration-200 active:scale-95 mt-4"
                >
                  Add to Cart
                </button>
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
                <button
                  onClick={handleAddToCart}
                  className="w-full md:w-auto bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 hover:to-red-600 text-white px-8 py-3 rounded-xl text-lg font-bold shadow-lg transition-all duration-200 active:scale-95 mt-4"
                >
                  Add to Cart
                </button>
              </div>
            )}
            <button
              onClick={() => addToWishlist(productData._id)}
              className={`mt-4 px-4 py-2 rounded ${
                wishlist && wishlist.includes(productData._id)
                  ? "bg-pink-400 text-white"
                  : "bg-gray-200"
              }`}
            >
              {wishlist && wishlist.includes(productData._id)
                ? "In Wishlist"
                : "Add to Wishlist"}
            </button>
          </div>
          <div className="border-t pt-6 mt-6 text-sm text-gray-500 flex flex-col gap-1">
            <p>✔️ 100% Original Product</p>
            <p>✔️ Online Payment Available</p>
            <p>✔️ 7-10 working days production time after confirmation</p>
          </div>
        </div>
      </div>
      {/* Description & Reviews */}
      <div
        id="description"
        className="max-w-6xl mx-auto mt-12 bg-white rounded-2xl shadow-lg p-8"
      >
        <div className="flex gap-4 border-b pb-4 mb-6">
          <b className="text-lg border-b-2 border-red-600 pb-2">Description</b>
        </div>
        <div
          className="flex flex-col gap-4 text-gray-600 text-base leading-relaxed"
          id="size-guide"
        >
          <p>{productData.description}</p>
          <p>Size Guide</p>
          {/* <div>
            <img src={assets.size_chart_demo} className="w-100" alt="" />
          </div> */}
        </div>
      </div>
      {/* Related Products */}
      <div className="max-w-6xl mx-auto mt-12">
        <RelatedProducts section={productData.section} />
      </div>
    </div>
  );
};

export default Product;
