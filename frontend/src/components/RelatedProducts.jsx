import React, { useContext, useEffect, useState } from "react";
import { shopContext } from "../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const RelatedProducts = ({ section, currentProductId }) => {
  const { products } = useContext(shopContext);
  const [related, setRelated] = useState([]);

  useEffect(() => {
    if (products.length > 0) {
      const productsCopy = products.filter(
        (item) => section === item.section && item._id !== currentProductId,
      );
      setRelated(productsCopy.slice(0, 5));
    } else {
      setRelated([]);
    }
  }, [products, section, currentProductId]);

  if (related.length === 0) {
    return null;
  }

  return (
    <div className="my-24">
      <div className="text-center text-3xl py-2">
        <Title text1={"RELATED"} text2={"PRODUCTS"} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {related.map((item) => (
          <ProductItem
            key={item._id}
            id={item._id}
            name={item.name}
            price={item.price}
            image={item.image}
            bestseller={item.bestseller}
            preorder={item.preorder}
            onSale={item.onSale}
            salePrice={item.salePrice}
            soldOut={item.soldOut}
          />
        ))}
      </div>
    </div>
  );
};

export default RelatedProducts;
