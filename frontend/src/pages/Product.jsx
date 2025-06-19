// import React, { useContext, useEffect, useState } from "react";
// import { useParams } from "react-router-dom";
// import { shopContext } from "../context/ShopContext";
// import RelatedProducts from "../components/RelatedProducts";

// const Product = () => {
//   const { productId } = useParams();
//   const { products, currency, addToCart } = useContext(shopContext);
//   const [productData, setProductData] = useState(false);
//   const [image, setImage] = useState("");
//   const [size, setSize] = useState("");

//   const fetchProductData = async () => {
//     products.map((item) => {
//       if (item._id === productId) {
//         setProductData(item);
//         setImage(item.image[0]);
//         return null;
//       }
//     });
//   };

//   useEffect(() => {
//     fetchProductData();
//   }, [productId, products]);

//   return productData ? (
//     <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
//       {/* ........PRODUCT DATA....... */}
//       <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
//         <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
//           <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
//             {productData.image.map((item, index) => (
//               <img
//                 onClick={() => setImage(item)}
//                 className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
//                 src={item}
//                 key={index}
//                 loading="lazy"
//               />
//             ))}
//           </div>
//           <div className="w-full sm:w-[80%]">
//             <img src={image} className="w-full h-auto" alt="" />
//           </div>
//         </div>

//         {/* ..........PRODUCT DETAILS......... */}
//         <div className="flex-1">
//           <h1 className="text-3xl mt-2 font-medium">{productData.name}</h1>
//           <p className="flex items-center mt-5 text-2xl font-medium">
//             {currency}
//             {productData.price}
//           </p>
//           <p className="mt-5 text-gray-500 md:w-4/5">
//             {productData.description}
//           </p>
//           <div className="flex flex-col gap-4 my-8">
//             <p>Select Size</p>
//             <div className="flex gap-2">
//               {productData.sizes.map((item, index) => (
//                 <button
//                   onClick={() => setSize(item)}
//                   key={index}
//                   className={`border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-300 ${
//                     item === size ? "border-red-500" : ""
//                   }`}
//                 >
//                   {item}
//                 </button>
//               ))}
//             </div>
//           </div>
//           <button
//             onClick={() => addToCart(productData._id, size)}
//             className="bg-red-800 text-white px-8 py-3 text-sm cursor-pointer active:bg-gray-700 "
//           >
//             ADD TO CART
//           </button>
//           <hr className="mt-8 sm:w-4/5" />
//           <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
//             <p>7-10 days (working days) production time after confirmation</p>
//             <p>100% Original Product</p>
//             <p>Cash on delivery available</p>
//           </div>
//         </div>
//       </div>

//       {/* .........DESCRIPTION.......... */}
//       <div className="mt-20">
//         <div className="flex">
//           <b className="border px-5 py-3 text-sm">Description</b>
//         </div>
//         <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
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

//       <RelatedProducts category={productData.category} />
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
  const { productId, productname } = useParams();
  const { products, currency, addToCart } = useContext(shopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState("");
  const [size, setSize] = useState("");

  const fetchProductData = async () => {
    products.map((item) => {
      if (item._id === productId) {
        setProductData(item);
        setImage(item.image[0]);
        return null; // Exit the map early once the product is found
      }
    });
  };

  useEffect(() => {
    fetchProductData();
  }, [productId, productname, products]);

  return productData ? (
    <div className="">
      <div className="border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100">
        {/* ............PRODUCT DATA............. */}
        <div className="flex gap-12 sm:gap-12 flex-col sm:flex-row">
          {/* .......... PRODUCT IMAGES............. */}
          <div className="flex-1 flex flex-col-reverse gap-3 sm:flex-row">
            <div className="flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full">
              {productData.image.map((item, index) => (
                <img
                  onClick={() => setImage(item)}
                  loading="lazy"
                  src={item}
                  key={index}
                  className="w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer"
                  alt=""
                />
              ))}
            </div>
            <div className="w-full sm:w-[80%]">
              <img src={image} className="w-full h-auto" alt="" />
            </div>
          </div>

          {/* .......... PRODUCT DETAILS ........ */}
          <div className="flex-1">
            <h1 className="font-medium text-2xl mt-2">{productData.name}</h1>
            {/* STARS?? */}
            <div className="flex items-center gap-1 mt-2">
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_icon} alt="" className="w-3 5" />
              <img src={assets.star_dull_icon} alt="" className="w-3 5" />
              <p className="pl-2">(122)</p>
            </div>
            <p className="mt-5 flex items-center text-3xl font-medium">
              {currency}
              {productData.price}
            </p>
            <p className="mt-5 text-gray-500 md:w-4/5">
              {productData.description}
            </p>
            <div className="flex flex-col gap-4 my-8">
              <p>Select Size</p>
              <div className="flex gap-2">
                {productData.sizes.map((item, index) => (
                  <button
                    onClick={() => setSize(item)}
                    key={index}
                    className={`border border-gray-300 px-4 py-2 rounded-md hover:bg-gray-100 transition-colors duration-300 ${
                      item === size ? "border-red-600" : ""
                    } `}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={() => addToCart(productData._id, size)}
              className="bg-red-800 cursor-pointer text-white px-8 py-3 text-sm active:bg-gray-700"
            >
              ADD TO CART
            </button>
            <hr className="mt-8 sm:w-4/5" />
            <div className="text-sm text-gray-500 mt-5 flex flex-col gap-1">
              <p>100% Original Product</p>
              <p>Cash on delivery available</p>
              <p>Easy return and exchange</p>
            </div>
          </div>
        </div>

        {/* .........DESCRIPTION.......... */}
        <div className="mt-20">
          <div className="flex">
            <b className="border px-5 py-3 text-sm">Description</b>
            <p className="border px-5 py-3 text-sm">Reviews(122)</p>
          </div>
          <div className="flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500">
            <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolorem
              ipsam non quam nihil culpa architecto, perferendis praesentium
              numquam animi magnam! Perferendis blanditiis eligendi ut dolorem?
              Reiciendis illum repellendus odio alias repudiandae et vel numquam
              obcaecati ipsum, accusamus possimus fugiat suscipit, iste rem
              voluptate doloremque earum cupiditate reprehenderit magni quam
              amet!
            </p>
            <p>
              Lorem ipsum dolor, sit amet consectetur adipisicing elit. Fugit
              eum rerum dicta alias atque nam quis vero ducimus voluptate,
              itaque sunt hic quae incidunt laboriosam corrupti, quaerat
              consectetur! Corporis deleniti quas aliquam cum quibusdam numquam
              odit laboriosam sunt, provident dolore.
            </p>
          </div>
        </div>

        {/* .........display related products........... */}

        <RelatedProducts category={productData.category} />
      </div>
    </div>
  ) : (
    <div className="opacity-0"></div>
  );
};

export default Product;
