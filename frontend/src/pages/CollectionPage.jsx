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
    }
  }, [products, sectionName]);

  useEffect(() => {
    setLoading(true);
    if (collection && collection.length > 0) {
      const col = collection.find(
        (item) => item.name.toLowerCase() === sectionName.toLowerCase()
      );
      setCollectionData(col || null);
      setLoading(false);
    }
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
      {collectionData.bannerImage && (
        <Banner
          image={collectionData.bannerImage[0]?.url}
          bannerText={collectionData.bannerText || collectionData.name}
        />
      )}

      <div className="container mx-auto px-4 py-8">
        <Title title={collectionData.name} />

        {collectionData.tagline && (
          <p className="text-lg text-center text-gray-600 mb-8 max-w-2xl mx-auto">
            {collectionData.tagline}
          </p>
        )}

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
              <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden bg-gray-200 group-hover:opacity-75">
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
                  {currency}
                  {convertPrice(product.price)}
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
