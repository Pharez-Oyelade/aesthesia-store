// import React, { useContext, useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { shopContext } from "../context/ShopContext";
// import { assets } from "../assets/assets";
// import RelatedProducts from "../components/RelatedProducts";

// const Product = () => {
//   const { productId, productname } = useParams();
//   const { products, currency, addToCart } = useContext(shopContext);
//   const [productData, setProductData] = useState(false);
//   const [image, setImage] = useState("");
//   const [size, setSize] = useState("");
//   const [quantity, setQuantity] = useState(1);
//   const [measurements, setMeasurements] = useState({
//     waist: "",
//     length: "",
//     hips: "",
//     bust: "",
//   });

//   const fetchProductData = async () => {
//     products.map((item) => {
//       if (item._id === productId) {
//         setProductData(item);
//         setImage(item.image[0]);
//         return null; // Exit the map early once the product is found
//       }
//     });
//   };

//   useEffect(() => {
//     fetchProductData();
//   }, [productId, productname, products]);

//   const handleMeasurementChange = (e) => {
//     setMeasurements({ ...measurements, [e.target.name]: e.target.value });
//   };

//   const handleAddToCart = (e) => {
//     e.preventDefault();
//     addToCart(productData._id, size, measurements, quantity);
//   };

//   return productData ? (
//     <div className="bg-gradient-to-br from-white to-gray-100 min-h-screen py-10">
//       <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12 flex flex-col md:flex-row gap-12">
//         {/* Product Images */}
//         <div className="flex-1 flex flex-col gap-6">
//           <div className="w-full aspect-square bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden shadow-md">
//             <img
//               src={image}
//               className="object-cover w-full h-full transition-transform duration-300 hover:scale-105"
//               alt={productData.name}
//             />
//           </div>
//           <div className="flex gap-3 justify-center mt-2">
//             {productData.image.map((item, index) => (
//               <img
//                 onClick={() => setImage(item)}
//                 loading="lazy"
//                 src={item}
//                 key={index}
//                 className={`w-16 h-16 object-cover rounded-lg border-2 cursor-pointer transition-all duration-200 ${
//                   image === item
//                     ? "border-red-600 scale-105"
//                     : "border-gray-200"
//                 }`}
//                 alt={productData.name + " thumbnail"}
//               />
//             ))}
//           </div>
//         </div>
//         {/* Product Details */}
//         <div className="flex-1 flex flex-col gap-6 justify-between">
//           <div>
//             <h1 className="font-bold text-3xl md:text-4xl text-gray-900 mb-2">
//               {productData.name}
//             </h1>
//             <div className="flex items-center gap-2 mb-4">
//               {[...Array(4)].map((_, i) => (
//                 <img
//                   src={assets.star_icon}
//                   alt="star"
//                   className="w-5 h-5"
//                   key={i}
//                 />
//               ))}
//               <img src={assets.star_dull_icon} alt="star" className="w-5 h-5" />
//               <span className="ml-2 text-gray-500 text-sm">(122 reviews)</span>
//             </div>
//             <p className="text-2xl font-semibold text-red-700 flex items-center mb-4">
//               {currency}
//               {productData.price}
//             </p>
//             <p className="text-gray-600 mb-6 leading-relaxed">
//               {productData.description}
//             </p>
//             <div className="mb-6">
//               <p className="font-medium mb-2">Select Size</p>
//               <div className="flex gap-3 flex-wrap">
//                 {productData.sizes.map((item, index) => (
//                   <button
//                     onClick={() => setSize(item)}
//                     key={index}
//                     className={`px-5 py-2 rounded-lg border-2 transition-all duration-200 font-semibold text-gray-700 focus:outline-none ${
//                       item === size
//                         ? "border-red-600 bg-red-50 text-red-700"
//                         : "border-gray-300 bg-white hover:bg-gray-100"
//                     }`}
//                   >
//                     {item}
//                   </button>
//                 ))}
//               </div>
//             </div>
//             {/* Measurements Form */}
//             <form
//               onSubmit={handleAddToCart}
//               className="flex flex-col gap-4 mt-4"
//             >
//               <p>Measurements for fitting</p>
//               <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
//                 <input
//                   type="number"
//                   name="waist"
//                   value={measurements.waist}
//                   onChange={handleMeasurementChange}
//                   placeholder="Waist (inches)"
//                   className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-200"
//                   min={0}
//                   required
//                 />
//                 <input
//                   type="number"
//                   name="length"
//                   value={measurements.length}
//                   onChange={handleMeasurementChange}
//                   placeholder="Length (inches)"
//                   className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-200"
//                   min={0}
//                   required
//                 />
//                 <input
//                   type="number"
//                   name="hips"
//                   value={measurements.hips}
//                   onChange={handleMeasurementChange}
//                   placeholder="Hips (inches)"
//                   className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-200"
//                   min={0}
//                   required
//                 />
//                 <input
//                   type="number"
//                   name="bust"
//                   value={measurements.bust}
//                   onChange={handleMeasurementChange}
//                   placeholder="Bust (inches)"
//                   className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-200"
//                   min={0}
//                   required
//                 />
//               </div>
//               {/* Quantity Controls */}
//               <div className="flex items-center gap-4 mt-2">
//                 <span className="font-medium">Quantity:</span>
//                 <button
//                   type="button"
//                   onClick={() => setQuantity((q) => Math.max(1, q - 1))}
//                   className="w-8 h-8 rounded-full bg-gray-200 text-xl font-bold flex items-center justify-center hover:bg-red-100"
//                 >
//                   -
//                 </button>
//                 <span className="text-lg font-semibold w-8 text-center">
//                   {quantity}
//                 </span>
//                 <button
//                   type="button"
//                   onClick={() => setQuantity((q) => q + 1)}
//                   className="w-8 h-8 rounded-full bg-gray-200 text-xl font-bold flex items-center justify-center hover:bg-red-100"
//                 >
//                   +
//                 </button>
//               </div>
//               <button
//                 type="submit"
//                 className="w-full md:w-auto bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 hover:to-red-600 text-white px-8 py-3 rounded-xl text-lg font-bold shadow-lg transition-all duration-200 active:scale-95 mt-4"
//               >
//                 Add to Cart
//               </button>
//             </form>
//           </div>
//           <div className="border-t pt-6 mt-6 text-sm text-gray-500 flex flex-col gap-1">
//             <p>✔️ 100% Original Product</p>
//             <p>✔️ Cash on delivery available</p>
//             <p>✔️ Easy return and exchange</p>
//             <p>✔️ 7-10 working days production time after confirmation</p>
//           </div>
//         </div>
//       </div>
//       {/* Description & Reviews */}
//       <div className="max-w-6xl mx-auto mt-12 bg-white rounded-2xl shadow-lg p-8">
//         <div className="flex gap-4 border-b pb-4 mb-6">
//           <b className="text-lg border-b-2 border-red-600 pb-2">Description</b>
//           {/* <span className="text-lg text-gray-400 pb-2">Reviews (122)</span> */}
//         </div>
//         <div className="flex flex-col gap-4 text-gray-600 text-base leading-relaxed">
//           <p>
//             Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
//             ipsam non quam nihil culpa architecto, perferendis praesentium
//             numquam animi magnam! Perferendis blanditiis eligendi ut dolorem?
//             Reiciendis illum repellendus odio alias repudiandae et vel numquam
//             obcaecati ipsum, accusamus possimus fugiat suscipit, iste rem
//             voluptate doloremque earum cupiditate reprehenderit magni quam amet!
//           </p>
//           <p>
//             Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugit eum
//             rerum dicta alias atque nam quis vero ducimus voluptate, itaque sunt
//             hic quae incidunt laboriosam corrupti, quaerat consectetur! Corporis
//             deleniti quas aliquam cum quibusdam numquam odit laboriosam sunt,
//             provident dolore.
//           </p>
//         </div>
//       </div>
//       {/* Related Products */}
//       <div className="max-w-6xl mx-auto mt-12">
//         <RelatedProducts section={productData.section} />
//       </div>
//     </div>
//   ) : (
//     <div className="opacity-0"></div>
//   );
// };

// export default Product;

import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { shopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";

const Product = () => {
  // Use the correct param name as per your route, fallback to id if needed
  const { productId, id } = useParams();
  const { products, currency, addToCart, wishlist, addToWishlist } =
    useContext(shopContext);

  // Find the product only after products are loaded
  const [productData, setProductData] = useState(null);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [measurements, setMeasurements] = useState({
    waist: "",
    length: "",
    hips: "",
    bust: "",
  });

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
    productData && productData.sizes ? productData.sizes : [];

  // Add to cart handler
  const handleAddToCart = (e) => {
    e.preventDefault();
    // if (availableSizes.length > 0 && !size) {
    //   alert("Please select a size");
    //   return;
    // }
    if (requiresMeasurements && Object.values(measurements).some((v) => !v)) {
      alert("Please fill all measurements");
      return;
    }
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
            <div className="flex items-center gap-2 mb-4">
              {[...Array(4)].map((_, i) => (
                <img
                  src={assets.star_icon}
                  alt="star"
                  className="w-5 h-5"
                  key={i}
                />
              ))}
              <img src={assets.star_dull_icon} alt="star" className="w-5 h-5" />
              <span className="ml-2 text-gray-500 text-sm">(122 reviews)</span>
            </div>
            <p className="text-2xl font-semibold text-red-700 flex items-center mb-4">
              {currency}
              {productData.price}
            </p>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {productData.description}
            </p>
            {availableSizes.length > 0 && (
              <div className="mb-6">
                <p className="font-medium mb-2">Select Size</p>
                <div className="flex gap-3 flex-wrap">
                  {availableSizes.map((item, index) => (
                    <button
                      onClick={() => setSize(item)}
                      key={index}
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
              </div>
            )}
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
                    required
                  />
                  <input
                    type="number"
                    name="length"
                    value={measurements.length}
                    onChange={handleMeasurementChange}
                    placeholder="Length (inches)"
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-200"
                    min={0}
                    required
                  />
                  <input
                    type="number"
                    name="hips"
                    value={measurements.hips}
                    onChange={handleMeasurementChange}
                    placeholder="Hips (inches)"
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-200"
                    min={0}
                    required
                  />
                  <input
                    type="number"
                    name="bust"
                    value={measurements.bust}
                    onChange={handleMeasurementChange}
                    placeholder="Bust (inches)"
                    className="border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-200"
                    min={0}
                    required
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
                  className="w-full md:w-auto bg-gradient-to-r from-red-700 to-red-500 hover:from-red-800 hover:to-red-600 text-white px-8 py-3 rounded-xl text-lg font-bold shadow-lg transition-all duration-200 active:scale-95 mt-4"
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
            <p>✔️ Cash on delivery available</p>
            <p>✔️ Easy return and exchange</p>
            <p>✔️ 7-10 working days production time after confirmation</p>
          </div>
        </div>
      </div>
      {/* Description & Reviews */}
      <div className="max-w-6xl mx-auto mt-12 bg-white rounded-2xl shadow-lg p-8">
        <div className="flex gap-4 border-b pb-4 mb-6">
          <b className="text-lg border-b-2 border-red-600 pb-2">Description</b>
        </div>
        <div className="flex flex-col gap-4 text-gray-600 text-base leading-relaxed">
          <p>{productData.description}</p>
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
