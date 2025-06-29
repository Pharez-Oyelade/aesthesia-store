import React, { useContext, useState } from "react";
import { shopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import Title from "./Title";
import ProductItem from "./ProductItem";

const PRODUCTS_PER_PAGE = 20; // Set how many products per page

const CollectionDisplay = ({ section }) => {
  const { products } = useContext(shopContext);
  const [currentPage, setCurrentPage] = useState(1);

  // Filter products by section (was category)
  const filteredProducts = products.filter(
    (product) => product.section === section
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / PRODUCTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIdx = startIdx + PRODUCTS_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(startIdx, endIdx);

  // Handle page change
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  return (
    <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]">
      {filteredProducts.length > 0 ? (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 mt-8">
            {paginatedProducts.map((product, index) => (
              <ProductItem
                key={index}
                id={product._id}
                name={product.name}
                price={product.price}
                image={product.image}
                bestseller={product.bestseller}
              />
            ))}
          </div>
          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-8 gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToPage(idx + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === idx + 1 ? "bg-gray-300" : ""
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center my-20">
          <div className="bg-red-200 p-20 rounded-2xl shadow-lg text-center">
            <h2 className="text-2xl font-semibold mb-4">No products found</h2>
            <p className="text-gray-600">
              There are no products in this section.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CollectionDisplay;
