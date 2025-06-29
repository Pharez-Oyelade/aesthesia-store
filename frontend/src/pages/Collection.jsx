import React, { useContext, useState, useEffect } from "react";
import FeaturedGrid from "../components/FeaturedGrid";
import Title from "../components/Title";
import { shopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import ProductItem from "../components/ProductItem";
import SortSelect from "../components/SortSelect";

const PRODUCTS_PER_PAGE = 16;

const Collection = () => {
  const { products, search, showSearch } = useContext(shopContext);
  const [showFilter, setShowFilter] = useState(false);
  const [filterProducts, setFilterProducts] = useState([]);
  const [sectionFilter, setSectionFilter] = useState([]); // was category
  const [sortType, setSortType] = useState("relevant");
  const [currentPage, setCurrentPage] = useState(1);

  // pagination
  const totalPages = Math.ceil(filterProducts.length / PRODUCTS_PER_PAGE);
  const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
  const endIdx = startIdx + PRODUCTS_PER_PAGE;
  const paginatedProducts = filterProducts.slice(startIdx, endIdx);

  // Handle page change
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  // toggle logic for section filter
  const toggleSection = (e) => {
    if (sectionFilter.includes(e.target.value)) {
      setSectionFilter((prev) =>
        prev.filter((item) => item !== e.target.value)
      );
    } else {
      setSectionFilter((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let filtered = products.slice();
    if (showSearch && search) {
      filtered = filtered.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.section.toLowerCase().includes(search.toLowerCase())
      );
    }
    if (sectionFilter.length > 0) {
      filtered = filtered.filter((item) =>
        sectionFilter.includes(item.section)
      );
    }
    setFilterProducts(filtered);
  };

  const sortProduct = () => {
    let fpCopy = filterProducts.slice();
    switch (sortType) {
      case "lowest-highest":
        fpCopy.sort((a, b) => a.price - b.price);
        setFilterProducts(fpCopy);
        break;
      case "highest-lowest":
        fpCopy.sort((a, b) => b.price - a.price);
        setFilterProducts(fpCopy);
        break;
      default:
        applyFilter();
        break;
    }
  };

  useEffect(() => {
    applyFilter();
  }, [sectionFilter, search, showSearch, products]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="bg-gradient-to-br from-white to-gray-100 min-h-screen py-0 ">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-8">
        {/* FILTER OPTIONS */}
        <aside className="w-full md:w-64 bg-white rounded-2xl shadow-md p-6 mb-8 md:mb-0">
          <p
            onClick={() => setShowFilter(!showFilter)}
            className="my-2 text-xl flex items-center cursor-pointer gap-2 font-semibold text-gray-800"
          >
            FILTERS
            <img
              src={assets.dropdown_icon}
              alt=""
              className={`h-3 md:hidden ${showFilter ? "rotate-90" : ""}`}
            />
          </p>
          {/* SECTION FILTER */}
          <div
            className={`border-t border-gray-200 pt-4 mt-4 ${
              showFilter ? "" : "hidden"
            } md:block`}
          >
            <p className="mb-3 text-sm font-medium text-gray-700">SECTIONS</p>
            <div className="flex flex-col gap-3 text-sm font-light text-gray-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  className="w-4 h-4 accent-red-600"
                  type="checkbox"
                  value={"clothes"}
                  onChange={toggleSection}
                  checked={sectionFilter.includes("clothes")}
                />
                Clothing
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  className="w-4 h-4 accent-red-600"
                  type="checkbox"
                  value={"wigs"}
                  onChange={toggleSection}
                  checked={sectionFilter.includes("wigs")}
                />
                Wigs
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  className="w-4 h-4 accent-red-600"
                  type="checkbox"
                  value={"jewelry"}
                  onChange={toggleSection}
                  checked={sectionFilter.includes("jewelry")}
                />
                Jewelry
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  className="w-4 h-4 accent-red-600"
                  type="checkbox"
                  value={"rere-collection"}
                  onChange={toggleSection}
                  checked={sectionFilter.includes("rere-collection")}
                />
                Rere Collection
              </label>
            </div>
          </div>
        </aside>
        {/* RIGHT SIDE */}
        <main className="flex-1 py-10">
          <div className="flex sm:flex-row justify-between items-center mb-8 gap-4">
            <div className="text-2xl">
              <Title text1={"ALL"} text2={"Collections"} />
            </div>

            {/* PRODUCT SORT */}
            <SortSelect sortType={sortType} setSortType={setSortType} />
          </div>
          {/* MAP PRODUCTS */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {paginatedProducts.map((item, index) => (
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
          {/* ........PAGINATION CONTROLS......... */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 gap-2">
              <button
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-4 py-2 border rounded-lg bg-white shadow disabled:opacity-50 hover:bg-gray-100"
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => goToPage(idx + 1)}
                  className={`px-4 py-2 border rounded-lg bg-white shadow hover:bg-red-100 transition-all duration-150 ${
                    currentPage === idx + 1
                      ? "bg-red-600 text-white font-bold"
                      : ""
                  }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="px-4 py-2 border rounded-lg bg-white shadow disabled:opacity-50 hover:bg-gray-100"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>
      <div className="text-center text-3xl mt-20">
        <Title text1={"FEATURED"} text2={"COLLECTIONS"} />
      </div>
      <div className="max-w-7xl mx-auto mt-8">
        <FeaturedGrid />
      </div>
    </div>
  );
};

export default Collection;
