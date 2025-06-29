import React, { useContext, useEffect, useState } from "react";
import { shopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";
import { Link } from "react-router-dom";

const RelatedProducts = ({ section }) => {
  const { products } = useContext(shopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      let productsCopy = products.slice();
      // Filter by section (was category)
      productsCopy = productsCopy.filter((item) => section === item.section);
      setRelated(productsCopy.slice(0, 5));
    }
  }, [products, section]);

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item, index) => (
          <ProductItem
            key={index}
            id={item._id}
            name={item.name}
            price={item.price}
            image={item.image}
            bestseller={item.bestseller}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
