import React, { useContext, useEffect, useState } from "react";
import { shopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const NewProducts = () => {
  const { products } = useContext(shopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  useEffect(() => {
    setLatestProducts(products.slice(0, 10));
  }, [products]);

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] py-10">
      <div className="text-center  py-8 text-3xl">
        <Title text1={"NEW"} text2={"PRODUCTS"} />
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Elevate your everyday with our latest products
        </p>
      </div>

      {/* Render Products */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {latestProducts.map((lp, index) => (
          <ProductItem
            key={index}
            id={lp._id}
            image={lp.image}
            name={lp.name}
            price={lp.price}
            bestseller={lp.bestseller}
          />
        ))}
      </div>
    </div>
  );
};

export default NewProducts;
