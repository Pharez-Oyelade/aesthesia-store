import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Banner from "../components/Banner";
import { BeatLoader } from "react-spinners";
import { shopContext } from "../context/ShopContext";
import Title from "../components/Title";

const CollectionPage = () => {
  const { sectionName } = useParams();
  const { collection, products, convertPrice, currency } =
    useContext(shopContext);
  const [loading, setLoading] = useState(true);
  const [collectionData, setCollectionData] = useState(null);
  const [sectionProducts, setSectionProducts] = useState([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  // Filter products for this section
  useEffect(() => {
    if (products && products.length > 0) {
      const filteredProducts = products.filter((item) => {
        const productSection = item.section?.toLowerCase?.() || "";
        const currentSection = sectionName?.toLowerCase?.() || "";
        return productSection === currentSection;
      });
      setSectionProducts(filteredProducts);
      setCurrentSlide(0); // Reset slide when section changes
    }
  }, [products, sectionName]);

  // Carousel timer
  useEffect(() => {
    if (sectionProducts.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % sectionProducts.length);
    }, 4000); // Change slide every 4 seconds
    return () => clearInterval(interval);
  }, [sectionProducts.length]);

  useEffect(() => {
    if (!collection) return;

    if (collection.length > 0) {
      const col = collection.find(
        (item) => item.name.toLowerCase() === sectionName.toLowerCase(),
      );
      setCollectionData(col || null);
      setLoading(false);
    }

    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, [collection, sectionName]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        {/* <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-gray-900"></div> */}
        <BeatLoader color="#b90606" />
      </div>
    );
  }

  if (!collectionData) {
    return (
      <div className="w-full m-0 min-h-screen flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Collection Not Found</h2>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-2 bg-black text-white hover:bg-gray-800 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {collectionData.bannerImage ? (
        <div className="px-4 sm:px-10 lg:px-10 pb-6">
          <div className="w-full min-h-[60vh] md:h-[70vh] mt-4 md:mt-8 rounded-3xl md:rounded-[2.5rem] flex flex-col md:flex-row items-center relative overflow-hidden shadow-2xl border border-gray-100 group">
            {/* Background Image (Collection Banner) */}
            <div className="absolute inset-0 z-0 bg-gray-50">
              <img
                src={collectionData.bannerImage[0]?.url}
                alt={collectionData.name}
                className="w-full h-full object-cover object-center opacity-90 transition-transform duration-1000 md:group-hover:scale-105"
              />
              {/* Overlays for text readability */}
              <div className="absolute inset-0 bg-gradient-to-b md:bg-gradient-to-r from-white/80 via-white/80 to-black/20 md:to-transparent"></div>
            </div>

            {/* Text Section (Left) */}
            <div className="text-center md:text-left flex flex-col items-center md:items-start z-10 w-full md:w-[60%] lg:w-[55%] px-6 md:px-12 lg:px-20 relative h-full justify-center pt-10 pb-40 md:pb-0 md:py-0">
              <div className="inline-block px-4 py-1.5 mb-4 md:mb-6 border border-gray-200 bg-white/50 backdrop-blur-md text-gray-900 rounded-full text-xs font-bold tracking-widest uppercase shadow-sm">
                {sectionName}
              </div>
              <h1 className="outfit-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl tracking-tight text-gray-900 mb-3 md:mb-5 leading-[1.1] capitalize max-w-full md:max-w-xl">
                {collectionData.bannerText || collectionData.name}
              </h1>
              {collectionData.tagline && (
                <p className="text-base sm:text-lg md:text-xl text-gray-800 font-light tracking-wide mb-6 md:mb-8 max-w-md drop-shadow-sm">
                  {collectionData.tagline}
                </p>
              )}
            </div>

            {/* Floating Product Card Carousel (Right/Bottom) */}
            {sectionProducts.length > 0 && (
              <div
                onClick={() =>
                  navigate(`/product/${sectionProducts[currentSlide]._id}`)
                }
                className="absolute bottom-6 left-1/2 -translate-x-1/2 md:left-auto md:translate-x-0 md:bottom-12 md:right-12 z-20 bg-white/85 backdrop-blur-lg p-3 md:p-4 rounded-[2rem] shadow-2xl flex items-center gap-4 w-[90%] sm:w-[400px] md:w-[380px] lg:w-[420px] border border-white/60 group/card cursor-pointer hover:bg-white transition-colors duration-300"
              >
                <div className="w-32 h-32 rounded-2xl overflow-hidden flex-shrink-0 p-2 flex items-center justify-center">
                  <img
                    key={currentSlide}
                    src={sectionProducts[currentSlide].image[0]?.url}
                    alt={sectionProducts[currentSlide].name}
                    className="w-full h-full object-cover mix-blend-multiply group-hover/card:scale-110 transition-transform duration-500 rounded-2xl"
                  />
                </div>
                <div className="flex flex-col justify-center flex-1 pr-2">
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="px-2 py-0.5 bg-gray-900 text-white text-[10px] uppercase font-bold rounded-sm tracking-wider">
                      Featured
                    </span>
                    {/* Carousel Indicators */}
                    {sectionProducts.length > 1 && (
                      <div className="flex gap-1.5">
                        {sectionProducts.slice(0, 5).map((_, idx) => (
                          <div
                            key={idx}
                            className={`w-1.5 h-1.5 rounded-full transition-colors ${idx === currentSlide % 5 ? "bg-gray-900" : "bg-gray-300"}`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <h3
                    key={`name-${currentSlide}`}
                    className="outfit-bold text-gray-900 text-base md:text-lg lg:text-xl line-clamp-1"
                  >
                    {sectionProducts[currentSlide].name}
                  </h3>
                  <p
                    key={`desc-${currentSlide}`}
                    className="text-gray-600 text-xs md:text-sm mt-0.5 mb-2 md:mb-3 line-clamp-2 leading-snug"
                  >
                    {sectionProducts[currentSlide].tagline ||
                      "Discover this collection highlight."}
                  </p>
                  <div className="flex justify-between items-center w-full mt-1">
                    <span
                      key={`price-${currentSlide}`}
                      className="outfit-bold text-gray-900 text-sm md:text-base"
                    >
                      {currency}
                      {convertPrice(
                        sectionProducts[currentSlide].salePrice ||
                          sectionProducts[currentSlide].price,
                      )}
                    </span>
                    <button className="w-8 h-8 md:w-10 md:h-10 rounded-full bg-black text-white flex items-center justify-center hover:bg-gray-800 transition-all group-hover/card:-rotate-45 shrink-0">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-4 h-4 md:w-5 md:h-5"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M4.5 19.5l15-15m0 0H8.25m11.25 0v11.25"
                        />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}

      <div className="container mx-auto px-4 py-8">
        <Title title={collectionData.name} />

        {/* {collectionData.tagline && (
          <p className="text-lg text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            {collectionData.tagline}
          </p>
        )} */}

        {collectionData.story && (
          <div className="mb-12 max-w-3xl mx-auto">
            <p className="text-center text-gray-700 leading-relaxed">
              {collectionData.story}
            </p>
          </div>
        )}

        {/* Display products grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sectionProducts.map((product) => (
            <div
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
              className="cursor-pointer group"
            >
              <div className="aspect-[3/4] w-full overflow-hidden bg-gray-200 group-hover:opacity-75 rounded-2xl">
                <img
                  src={product.image[0].url}
                  alt={product.name}
                  className="h-full w-full object-cover object-center"
                />
              </div>
              <div className="mt-4 flex justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">
                    {product.name}
                  </h3>
                  <p className="mt-1 text-sm text-gray-500">
                    {product.tagline}
                  </p>
                </div>
                <p className="text-sm font-medium text-gray-900">
                  {/* {convertPrice(product.price)} */}

                  {product.onSale ? (
                    <>
                      <span className="line-through text-xs text-gray-400">
                        {currency}
                        {convertPrice(product.price)}
                      </span>
                      <span className="pl-2">
                        {currency}
                        {convertPrice(product.salePrice)}
                      </span>
                    </>
                  ) : (
                    <span className="">
                      {currency}
                      {convertPrice(product.price)}
                    </span>
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        {sectionProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No products available in this collection yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionPage;
