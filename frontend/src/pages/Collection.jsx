// import React, { useContext, useState, useEffect } from "react";
// import FeaturedGrid from "../components/FeaturedGrid";
// import Title from "../components/Title";
// import { shopContext } from "../context/ShopContext";
// import { assets } from "../assets/assets";
// import ProductItem from "../components/ProductItem";
// import SortSelect from "../components/SortSelect";

// const PRODUCTS_PER_PAGE = 16;

// const Collection = () => {
//   const { products, search, showSearch } = useContext(shopContext);
//   const [showFilter, setShowFilter] = useState(false);
//   const [filterProducts, setFilterProducts] = useState([]);
//   const [category, setCategory] = useState([]);
//   const [sortType, setSortType] = useState("relevant");

//   const [currentPage, setCurrentPage] = useState(1);

//   // pagination
//   const totalPages = Math.ceil(filterProducts.length / PRODUCTS_PER_PAGE);
//   const startIdx = (currentPage - 1) * PRODUCTS_PER_PAGE;
//   const endIdx = startIdx + PRODUCTS_PER_PAGE;
//   const paginatedProducts = filterProducts.slice(startIdx, endIdx);

//   // Handle page change
//   const goToPage = (page) => {
//     if (page >= 1 && page <= totalPages) setCurrentPage(page);
//   };

//   // toogle logic
//   const toggleCategory = (e) => {
//     if (category.includes(e.target.value)) {
//       setCategory((prev) => prev.filter((item) => item !== e.target.value));
//     } else {
//       setCategory((prev) => [...prev, e.target.value]);
//     }
//   };

//   const applyFilter = () => {
//     let filteredProducts = products.slice();
//     if (showSearch && search) {
//       filteredProducts = filteredProducts.filter(
//         (item) =>
//           item.name.toLowerCase().includes(search.toLowerCase()) ||
//           item.section.toLowerCase().includes(search.toLowerCase()) ||
//           item.category.toLowerCase().includes(search.toLowerCase())
//       );
//     }

//     if (category.length > 0) {
//       filteredProducts = filteredProducts.filter(
//         (item) =>
//           category.includes(item.category) || category.includes(item.section)
//       );
//     }

//     setFilterProducts(filteredProducts);
//   };

//   const sortProduct = () => {
//     let fpCopy = filterProducts.slice();

//     switch (sortType) {
//       case "lowest-highest":
//         fpCopy.sort((a, b) => a.price - b.price);
//         setFilterProducts(fpCopy);
//         break;
//       case "highest-lowest":
//         fpCopy.sort((a, b) => b.price - a.price);
//         setFilterProducts(fpCopy);
//         break;
//       default:
//         applyFilter();
//         break;
//     }
//   };

//   useEffect(() => {
//     applyFilter();
//   }, [category, search, showSearch]);

//   useEffect(() => {
//     sortProduct();
//   }, [sortType]);

//   return (
//     <div>
//       <div className="flex flex-col sm:flex-row gap-1 sm:gap-10 pt-10 border-t mb-20">
//         {/* FILTER OPTIONS */}
//         <div className="min-w-60">
//           <p
//             onClick={() => setShowFilter(!showFilter)}
//             className="my-2 text-xl flex items-center cursor-pointer gap-2"
//           >
//             FILTERS
//             <img
//               src={assets.dropdown_icon}
//               alt=""
//               className={`h-3 sm:hidden ${showFilter ? "rotate-90" : ""}`}
//             />
//           </p>

//           {/* CATEGORY FILTER */}
//           <div
//             className={`border border-gray-300 pl-5 py-3 mt-6 ${
//               showFilter ? "" : "hidden"
//             } sm:block `}
//           >
//             <p className="mb-3 text-sm font-medium">CATEGORIES</p>
//             <div className="flex flex-col gap-2 text-sm font-light text-gray-700">
//               <p className="flex gap-2">
//                 <input
//                   className="w-3"
//                   type="checkbox"
//                   value={"Men"}
//                   onChange={toggleCategory}
//                 />{" "}
//                 Men
//               </p>
//               <p className="flex gap-2">
//                 <input
//                   className="w-3"
//                   type="checkbox"
//                   value={"Women"}
//                   onChange={toggleCategory}
//                 />{" "}
//                 women
//               </p>
//               <p className="flex gap-2">
//                 <input
//                   className="w-3"
//                   type="checkbox"
//                   value={"rere"}
//                   onChange={toggleCategory}
//                 />{" "}
//                 rere
//               </p>
//               <p className="flex gap-2">
//                 <input
//                   className="w-3"
//                   type="checkbox"
//                   value={"Kids"}
//                   onChange={toggleCategory}
//                 />{" "}
//                 Kids
//               </p>
//             </div>
//           </div>
//         </div>

//         {/* RIGHT SIDE */}
//         <div className="flex-1">
//           <div className="flex justify-between text-base sm:text-2xl mb-4">
//             <Title text1={"ALL"} text2={"Collections"} />
//             {/* PRODUCT SORT */}
//             <SortSelect sortType={sortType} setSortType={setSortType} />
//           </div>

//           {/* MAP PRODUCTS */}
//           <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 gap-y-6">
//             {paginatedProducts.map((item, index) => (
//               <ProductItem
//                 key={index}
//                 id={item._id}
//                 name={item.name}
//                 price={item.price}
//                 image={item.image}
//               />
//             ))}
//           </div>

//           {/* ........PAGINATION CONTROLS......... */}
//           {totalPages > 1 && (
//             <div className="flex justify-center mt-8 gap-2">
//               <button
//                 onClick={() => goToPage(currentPage - 1)}
//                 disabled={currentPage === 1}
//                 className="px-3 py-1 border rounded disabled:opacity-50"
//               >
//                 Prev
//               </button>
//               {[...Array(totalPages)].map((_, idx) => (
//                 <button
//                   key={idx}
//                   onClick={() => goToPage(idx + 1)}
//                   className={`px-3 py-1 border rounded ${
//                     currentPage === idx + 1 ? "bg-gray-300" : ""
//                   }`}
//                 >
//                   {idx + 1}
//                 </button>
//               ))}
//               <button
//                 onClick={() => goToPage(currentPage + 1)}
//                 disabled={currentPage === totalPages}
//                 className="px-3 py-1 border rounded disabled:opacity-50"
//               >
//                 Next
//               </button>
//             </div>
//           )}
//         </div>
//       </div>
//       <div className="text-center text-3xl">
//         <Title text1={"FEATURED"} text2={"COLLECTIONS"} />
//       </div>

//       <FeaturedGrid />
//     </div>
//   );
// };

// export default Collection;

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
  const [category, setCategory] = useState([]);
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

  // toogle logic
  const toggleCategory = (e) => {
    if (category.includes(e.target.value)) {
      setCategory((prev) => prev.filter((item) => item !== e.target.value));
    } else {
      setCategory((prev) => [...prev, e.target.value]);
    }
  };

  const applyFilter = () => {
    let filteredProducts = products.slice();
    if (showSearch && search) {
      filteredProducts = filteredProducts.filter(
        (item) =>
          item.name.toLowerCase().includes(search.toLowerCase()) ||
          item.section.toLowerCase().includes(search.toLowerCase()) ||
          item.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (category.length > 0) {
      filteredProducts = filteredProducts.filter(
        (item) =>
          category.includes(item.category) || category.includes(item.section)
      );
    }

    setFilterProducts(filteredProducts);
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
  }, [category, search, showSearch]);

  useEffect(() => {
    sortProduct();
  }, [sortType]);

  return (
    <div className="bg-gradient-to-br from-white to-gray-100 min-h-screen py-10">
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
          {/* CATEGORY FILTER */}
          <div
            className={`border-t border-gray-200 pt-4 mt-4 ${
              showFilter ? "" : "hidden"
            } md:block`}
          >
            <p className="mb-3 text-sm font-medium text-gray-700">CATEGORIES</p>
            <div className="flex flex-col gap-3 text-sm font-light text-gray-700">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  className="w-4 h-4 accent-red-600"
                  type="checkbox"
                  value={"Men"}
                  onChange={toggleCategory}
                  checked={category.includes("Men")}
                />
                Men
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  className="w-4 h-4 accent-red-600"
                  type="checkbox"
                  value={"Women"}
                  onChange={toggleCategory}
                  checked={category.includes("Women")}
                />
                Women
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  className="w-4 h-4 accent-red-600"
                  type="checkbox"
                  value={"rere"}
                  onChange={toggleCategory}
                  checked={category.includes("rere")}
                />
                rere
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  className="w-4 h-4 accent-red-600"
                  type="checkbox"
                  value={"Kids"}
                  onChange={toggleCategory}
                  checked={category.includes("Kids")}
                />
                Kids
              </label>
            </div>
          </div>
        </aside>
        {/* RIGHT SIDE */}
        <main className="flex-1">
          <div className="flex sm:flex-row justify-between items-center mb-8 gap-4">
            <Title text1={"ALL"} text2={"Collections"} />
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
