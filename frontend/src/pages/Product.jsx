import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Link, useParams } from "react-router-dom";
import { LuChevronDown, LuChevronUp, LuMaximize2 } from "react-icons/lu";
import { shopContext } from "../context/ShopContext";
import { assets } from "../assets/assets";
import RelatedProducts from "../components/RelatedProducts";
import { trackAddToCart, trackViewContent } from "../utils/metaPixel";
import {
  trackAddToCart as trackAddToCartTT,
  trackViewContent as trackViewContentTT,
} from "../utils/tiktokPixel";
import { getOptimizedUrl } from "../utils/cloudinaryHelper";
import { productReviews } from "../../data/productReview";
import ProductReview from "../components/ProductReview";
import ProductImageLightbox from "../components/ProductImageLightbox";
import AddedToCartModal from "../components/AddedToCartModal";

const MEASUREMENT_FIELDS = [
  { name: "waist", label: "Waist (in)", placeholder: "e.g. 28" },
  { name: "length", label: "Length (in)", placeholder: "e.g. 42" },
  { name: "hips", label: "Hips (in)", placeholder: "e.g. 38" },
  { name: "bust", label: "Bust (in)", placeholder: "e.g. 34" },
  { name: "sleeveLength", label: "Sleeve Length (in)", placeholder: "e.g. 23" },
];

const HEIGHT_FIT_GUIDE = [
  { label: "Petite", range: "5'0\"–5'5\"" },
  { label: "Regular", range: "5'6\"–5'8\"" },
  { label: "Tall", range: "5'9\"–5'11\"" },
];

const Product = () => {
  const { productId, id } = useParams();
  const {
    products,
    productsLoading,
    currency,
    addToCart,
    wishlist,
    addToWishlist,
    convertPrice,
    navigate,
    PLUS_SIZE_FEE,
    CUSTOM_COLOR_FEE,
    isPlusSize,
    isCustomColor,
  } = useContext(shopContext);

  const [productData, setProductData] = useState(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [fitLength, setFitLength] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [measurements, setMeasurements] = useState({
    waist: "",
    length: "",
    hips: "",
    bust: "",
    sleeveLength: "",
  });
  const [showMeasurements, setShowMeasurements] = useState(false);
  const trackedProductId = useRef(null);
  const [displayedReviews, setDisplayedReviews] = useState([]);
  const [activeTab, setActiveTab] = useState("description");
  const [note, setNote] = useState("");
  const [formError, setFormError] = useState("");
  const [missingFieldKey, setMissingFieldKey] = useState("");
  const [addedToCartSummary, setAddedToCartSummary] = useState(null);

  const sizeSectionRef = useRef(null);
  const colorSectionRef = useRef(null);
  const customColorSectionRef = useRef(null);
  const customColorInputRef = useRef(null);
  const fitLengthSectionRef = useRef(null);
  const descriptionSectionRef = useRef(null);

  const isCustom = isCustomColor(color);
  const reviewsEnabled = import.meta.env.VITE_REVIEWS_ENABLED === "true";

  const productImages = useMemo(
    () => (productData?.image || []).filter((item) => Boolean(item?.url)),
    [productData],
  );
  const activeImageIndex =
    productImages.length > 0
      ? Math.min(selectedImageIndex, productImages.length - 1)
      : 0;
  const image = productImages[activeImageIndex]?.url || "";

  const closeImageModal = useCallback(() => {
    setIsImageModalOpen(false);
  }, []);

  const closeSizeGuideModal = useCallback(() => {
    setIsSizeGuideOpen(false);
  }, []);

  const closeAddedModal = useCallback(() => {
    setAddedToCartSummary(null);
  }, []);

  const scrollToTab = useCallback((e, tabId) => {
    e.preventDefault();
    setActiveTab(tabId);
    descriptionSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, []);

  const tabs = useMemo(() => {
    const list = [{ id: "description", label: "Description" }];
    if (productData?.story?.trim()) {
      list.push({ id: "story", label: "Story" });
    }
    list.push({ id: "size-guide", label: "Size Guide" });
    return list;
  }, [productData]);

  const renderTabContent = () => {
    switch (activeTab) {
      case "description":
        return (
          <div className="space-y-3">
            <p className="font-bold text-gray-900">{productData.name}</p>
            {productData.tagline && (
              <p className="italic text-gray-600">{productData.tagline}</p>
            )}
            <p className="whitespace-pre-wrap">{productData.description}</p>
            {productData.specificDetails && (
              <p className="pt-2 font-medium text-gray-800">
                {productData.specificDetails}
              </p>
            )}
          </div>
        );
      case "story":
        return <p className="whitespace-pre-wrap">{productData.story}</p>;
      case "size-guide":
        return (
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => setIsSizeGuideOpen(true)}
              aria-label="View full size Aesthesia size guide chart"
              className="group relative w-full max-w-2xl mx-auto rounded-lg overflow-hidden cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[#691110]"
            >
              <img
                src={assets.size_chart}
                className="w-full h-auto rounded-lg block"
                alt="Aesthesia size guide chart"
              />
              <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/65 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white shadow-md opacity-90 md:opacity-0 md:group-hover:opacity-100 md:group-focus-visible:opacity-100 transition-opacity duration-200">
                <LuMaximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                <span>Expand</span>
              </span>
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  const charLimit = 220;

  // Reset product state when navigating between products
  useEffect(() => {
    if (products && products.length > 0) {
      const prod = products.find((item) => item._id === (productId || id));
      setProductData(prod || null);
      setSelectedImageIndex(0);
      setIsImageModalOpen(false);
      setIsSizeGuideOpen(false);
      setAddedToCartSummary(null);
      setSize("");
      setColor("");
      setFitLength("");
      setQuantity(1);
      setNote("");
      setActiveTab("description");
      setShowMeasurements(false);
      setMeasurements({
        waist: "",
        length: "",
        hips: "",
        bust: "",
        sleeveLength: "",
      });
      setFormError("");
      setMissingFieldKey("");
    } else if (!productsLoading) {
      setProductData(null);
    }
  }, [products, productsLoading, productId, id]);

  useEffect(() => {
    if (!productData || trackedProductId.current === productData._id) return;

    trackViewContent(productData);
    trackViewContentTT(productData);
    trackedProductId.current = productData._id;
  }, [productData]);

  useEffect(() => {
    if (productData) {
      const filtered = productReviews.filter(
        (review) =>
          review.product === productData.name ||
          review.product === productData.section,
      );
      setDisplayedReviews(filtered);
    }
  }, [productData]);

  const handleMeasurementChange = (e) => {
    setMeasurements({ ...measurements, [e.target.name]: e.target.value });
  };

  const requiresMeasurements = productData && productData.section !== "Still Her";
  const availableSizes = useMemo(
    () =>
      productData?.sizes
        ? productData.sizes.slice().sort((a, b) => Number(a) - Number(b))
        : [],
    [productData],
  );
  const availableColors = useMemo(
    () => (productData?.colors ? productData.colors : []),
    [productData],
  );
  const availableFitLengths = useMemo(
    () => (productData?.fitLength ? productData.fitLength : []),
    [productData],
  );

  // Check required selections in top-to-bottom visual order
  const missingOption = useMemo(() => {
    if (availableSizes.length > 0 && !size) {
      return {
        key: "size",
        message: "Please select a size",
        ref: sizeSectionRef,
      };
    }
    if (availableColors.length > 0 && !color) {
      return {
        key: "color",
        message: "Please select a color",
        ref: colorSectionRef,
      };
    }
    if (isCustom && !note.trim()) {
      return {
        key: "customColor",
        message: "Please enter a custom color",
        ref: customColorSectionRef,
        focusRef: customColorInputRef,
      };
    }
    if (availableFitLengths.length > 0 && !fitLength) {
      return {
        key: "fitLength",
        message: "Please select a length",
        ref: fitLengthSectionRef,
      };
    }
    return null;
  }, [
    availableSizes.length,
    size,
    availableColors.length,
    color,
    isCustom,
    note,
    availableFitLengths.length,
    fitLength,
  ]);

  const averageRating = useMemo(() => {
    if (!displayedReviews.length) return 0;
    const sum = displayedReviews.reduce(
      (acc, r) => acc + (Number(r.rating) || 0),
      0,
    );
    return Math.round((sum / displayedReviews.length) * 10) / 10;
  }, [displayedReviews]);

  const enteredMeasurementCount = Object.values(measurements).filter(
    (v) => String(v).trim() !== "",
  ).length;

  const baseUnitPrice = productData
    ? Number(productData.onSale ? productData.salePrice : productData.price) ||
      0
    : 0;
  const plusSizeUnitFee = size && isPlusSize(size) ? PLUS_SIZE_FEE : 0;
  const customColorUnitFee = isCustom ? CUSTOM_COLOR_FEE : 0;
  const totalUnitFees = plusSizeUnitFee + customColorUnitFee;
  const unitTotalPrice = baseUnitPrice + totalUnitFees;
  const lineTotalPrice = unitTotalPrice * quantity;

  const scrollToMissingOption = (missing) => {
    setMissingFieldKey(missing.key);
    setFormError(missing.message);

    const sectionEl = missing.ref?.current;
    if (sectionEl) {
      sectionEl.scrollIntoView({ behavior: "smooth", block: "center" });
      const focusTarget =
        missing.focusRef?.current ||
        sectionEl.querySelector("button:not([disabled]), input:not([disabled])");
      focusTarget?.focus({ preventScroll: true });
    }
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (!productData || productData.soldOut) return;

    if (missingOption) {
      scrollToMissingOption(missingOption);
      return;
    }

    setFormError("");
    setMissingFieldKey("");

    addToCart(
      productData._id,
      size,
      color,
      { ...measurements, fitLength },
      quantity,
      note,
    );
    trackAddToCart(productData, quantity, {
      size,
      color,
      fitLength,
    });
    trackAddToCartTT(productData, quantity);

    setAddedToCartSummary({
      name: productData.name,
      imageUrl: image,
      size,
      color,
      note: isCustom ? note.trim() : "",
      fitLength,
      quantity,
      lineTotal: lineTotalPrice,
      preorder: Boolean(productData.preorder),
    });
  };

  if (productsLoading && (!products || products.length === 0)) {
    return (
      <div className="min-h-screen py-6 md:py-10">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl px-4 py-5 md:p-12 animate-pulse">
          <div className="h-4 w-48 bg-gray-200 rounded mb-6" />
          <div className="flex flex-col md:flex-row gap-12">
            <div className="flex-1 flex flex-col gap-4">
              <div className="w-full aspect-square bg-gray-200 rounded-2xl" />
              <div className="flex justify-center gap-3">
                {[1, 2, 3].map((n) => (
                  <div key={n} className="w-16 h-16 bg-gray-200 rounded-lg" />
                ))}
              </div>
            </div>
            <div className="flex-1 space-y-5">
              <div className="h-9 w-2/3 bg-gray-200 rounded" />
              <div className="h-6 w-1/3 bg-gray-200 rounded" />
              <div className="h-20 w-full bg-gray-200 rounded" />
              <div className="h-12 w-3/4 bg-gray-200 rounded" />
              <div className="h-12 w-3/4 bg-gray-200 rounded" />
              <div className="h-14 w-1/2 bg-gray-200 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Product not found
        </h1>
        <p className="text-gray-600 mb-6">
          This piece may no longer be available or the link is invalid.
        </p>
        <Link
          to="/collection"
          className="bg-[#691110] hover:bg-red-800 text-white px-6 py-3 rounded-xl font-semibold transition"
        >
          Browse Collections
        </Link>
      </div>
    );
  }

  const isWishlisted = Boolean(wishlist && wishlist.includes(productData._id));
  const ctaLabel = productData.soldOut
    ? "Sold Out"
    : missingOption
      ? "Select Options"
      : productData.preorder
        ? "Preorder Now"
        : "Add to Cart";

  return (
    <div>
      <div className="min-h-screen py-6 md:py-10">
        <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-2xl px-4 py-5 md:p-12">
          {/* Breadcrumb */}
          <nav
            aria-label="Breadcrumb"
            className="flex items-center flex-wrap gap-2 text-xs sm:text-sm text-gray-500 mb-6"
          >
            <Link to="/" className="hover:text-[#691110] transition-colors">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            <Link
              to="/collection"
              className="hover:text-[#691110] transition-colors"
            >
              Collections
            </Link>
            {productData.section && (
              <>
                <span aria-hidden="true">/</span>
                <Link
                  to={`/collection/${encodeURIComponent(productData.section.toLowerCase())}`}
                  className="hover:text-[#691110] transition-colors"
                >
                  {productData.section}
                </Link>
              </>
            )}
            <span aria-hidden="true">/</span>
            <span
              aria-current="page"
              className="text-gray-800 font-medium truncate max-w-[200px] sm:max-w-xs"
            >
              {productData.name}
            </span>
          </nav>

          <div className="flex flex-col md:flex-row gap-10 lg:gap-12">
            {/* Product Images (Sticky on desktop) */}
            <div className="flex-1 flex flex-col gap-5 md:sticky md:top-32 md:self-start md:h-fit">
              <div className="w-full aspect-square bg-gray-50 rounded-2xl flex items-center justify-center overflow-hidden shadow-md relative group">
                {image ? (
                  <button
                    type="button"
                    onClick={() => setIsImageModalOpen(true)}
                    className="relative w-full h-full cursor-zoom-in focus:outline-none focus-visible:ring-2 focus-visible:ring-[#691110] rounded-2xl overflow-hidden block"
                    aria-label={`View full size image of ${productData.name}`}
                  >
                    <img
                      src={getOptimizedUrl(image, 800)}
                      className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                      alt={productData.name}
                    />
                    <span className="pointer-events-none absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full bg-black/65 backdrop-blur-sm px-3 py-1.5 text-xs font-medium text-white shadow-md opacity-90 md:opacity-0 md:group-hover:opacity-100 md:group-focus-within:opacity-100 transition-opacity duration-200">
                      <LuMaximize2 className="w-3.5 h-3.5" aria-hidden="true" />
                      <span>Expand</span>
                    </span>
                  </button>
                ) : (
                  <div className="text-sm text-gray-400">
                    No image available
                  </div>
                )}
              </div>
              {productImages.length > 0 && (
                <div className="flex flex-wrap gap-3 justify-center">
                  {productImages.map((item, index) => (
                    <button
                      type="button"
                      key={`${item.url}-${index}`}
                      onClick={() => setSelectedImageIndex(index)}
                      aria-label={`View ${productData.name} image ${index + 1}`}
                      aria-current={
                        activeImageIndex === index ? "true" : undefined
                      }
                      className={`w-16 h-16 rounded-lg border-2 cursor-pointer overflow-hidden transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#691110] ${
                        activeImageIndex === index
                          ? "border-[#691110] scale-105"
                          : "border-gray-200 hover:border-gray-400"
                      }`}
                    >
                      <img
                        loading="lazy"
                        src={getOptimizedUrl(item.url, 400)}
                        className="w-full h-full object-cover block"
                        alt={`${productData.name} thumbnail ${index + 1}`}
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Details & Purchasing Flow */}
            <div className="flex-1 flex flex-col gap-6 justify-between">
              <div>
                <h1 className="font-bold text-2xl sm:text-3xl md:text-4xl text-gray-900 mb-1.5">
                  {productData.name}
                </h1>

                {productData.tagline && (
                  <p className="text-sm italic text-gray-600 mb-3">
                    {productData.tagline}
                  </p>
                )}

                {/* Social Proof Reviews Anchor */}
                {reviewsEnabled && displayedReviews.length > 0 && (
                  <a
                    href="#reviews-section"
                    className="inline-flex items-center gap-2 mb-4 cursor-pointer hover:underline text-sm text-gray-600"
                  >
                    <div className="flex text-yellow-400" aria-hidden="true">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                          key={star}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill={
                            star <= Math.round(averageRating)
                              ? "currentColor"
                              : "none"
                          }
                          stroke="currentColor"
                          strokeWidth={1.5}
                          className="w-4 h-4"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"
                          />
                        </svg>
                      ))}
                    </div>
                    <span>
                      {averageRating.toFixed(1)} ({displayedReviews.length}{" "}
                      {displayedReviews.length === 1 ? "Review" : "Reviews"})
                    </span>
                  </a>
                )}

                {/* Preorder Tag */}
                {productData.preorder && !productData.soldOut && (
                  <div className="mb-4">
                    <span className="inline-block bg-yellow-400 text-yellow-950 text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                      Preorder
                    </span>
                    <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                      <p className="text-sm text-yellow-900">
                        <strong>Preorder Notice:</strong> This item is available
                        for preorder and will ship once it becomes available.
                      </p>
                    </div>
                  </div>
                )}

                {/* Sold Out Tag */}
                {productData.soldOut && (
                  <div className="mb-4">
                    <span className="inline-block bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-xs">
                      Sold Out
                    </span>
                    <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800">
                        <strong>Sold Out:</strong> This product is currently out
                        of stock and cannot be ordered.
                      </p>
                    </div>
                  </div>
                )}

                {/* Price */}
                <div className="mb-4">
                  <div className="text-2xl sm:text-3xl font-semibold text-[#691110] flex items-center flex-wrap gap-2">
                    {productData.onSale ? (
                      <p className="flex flex-wrap items-center">
                        <span className="flex items-center line-through text-gray-400 mr-3 text-xl">
                          {currency}
                          {convertPrice(productData.price)}
                        </span>
                        <span className="flex items-center text-red-600">
                          {currency}
                          {convertPrice(unitTotalPrice)}
                        </span>
                        <span className="ml-2 bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold">
                          Sale
                        </span>
                      </p>
                    ) : (
                      <div className="flex items-center">
                        {currency}
                        {convertPrice(unitTotalPrice)}
                      </div>
                    )}
                  </div>
                  {totalUnitFees > 0 && (
                    <p className="mt-1 text-xs sm:text-sm text-gray-600 flex flex-wrap items-center gap-x-1.5">
                      <span>
                        Base: {currency}
                        {convertPrice(baseUnitPrice)}
                      </span>
                      {plusSizeUnitFee > 0 && (
                        <span>
                          + Plus Size ({currency}
                          {convertPrice(plusSizeUnitFee)})
                        </span>
                      )}
                      {customColorUnitFee > 0 && (
                        <span>
                          + Custom Color ({currency}
                          {convertPrice(customColorUnitFee)})
                        </span>
                      )}
                    </p>
                  )}
                </div>

                {/* Summary Description */}
                <p className="text-gray-600 mb-4 leading-relaxed text-base">
                  {productData.description.length > charLimit
                    ? productData.description.substring(0, charLimit) + "..."
                    : productData.description}{" "}
                  {productData.description.length > charLimit && (
                    <a
                      onClick={(e) => scrollToTab(e, "description")}
                      href="#description"
                      className="cursor-pointer underline text-sm font-medium text-[#691110] hover:text-red-700"
                    >
                      Full description
                    </a>
                  )}
                </p>

                {productData.specificDetails && (
                  <p className="mb-5 text-sm font-semibold text-gray-800">
                    {productData.specificDetails}
                  </p>
                )}

                {/* Purchase Form */}
                <form onSubmit={handleAddToCart} className="flex flex-col gap-5">
                  {/* Size Selection */}
                  {availableSizes.length > 0 && (
                    <div
                      ref={sizeSectionRef}
                      role="group"
                      aria-labelledby="select-size-label"
                      className={`scroll-mt-36 rounded-xl transition-all duration-200 ${
                        missingFieldKey === "size"
                          ? "ring-2 ring-red-400 bg-red-50/50 p-3 -mx-3"
                          : ""
                      }`}
                    >
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <p
                          id="select-size-label"
                          className="font-medium text-gray-900"
                        >
                          Select Size
                          {size && (
                            <span className="ml-2 text-sm font-semibold text-[#691110]">
                              — {size}
                            </span>
                          )}
                        </p>
                        <a
                          onClick={(e) => scrollToTab(e, "size-guide")}
                          href="#description"
                          className="text-xs sm:text-sm text-[#691110] underline hover:text-red-700"
                        >
                          Size guide
                        </a>
                      </div>
                      <div className="flex gap-2.5 flex-wrap">
                        {availableSizes.map((item, index) => (
                          <button
                            type="button"
                            aria-pressed={item === size}
                            disabled={productData.soldOut}
                            onClick={() => {
                              setSize(item);
                              if (missingFieldKey === "size") {
                                setMissingFieldKey("");
                              }
                              setFormError("");
                            }}
                            key={index}
                            className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#691110] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                              item === size
                                ? "border-[#691110] bg-red-50 text-[#691110]"
                                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                      {missingFieldKey === "size" && (
                        <p className="text-xs font-medium text-red-600 mt-2">
                          Please select a size to continue.
                        </p>
                      )}
                      {size && isPlusSize(size) && (
                        <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                          <p className="text-xs sm:text-sm text-blue-800">
                            <strong>Plus Size Notice:</strong> An additional fee
                            of {currency}
                            {convertPrice(PLUS_SIZE_FEE)} applies to size{" "}
                            {size}.
                          </p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Color Selection */}
                  {availableColors.length > 0 && (
                    <div
                      ref={colorSectionRef}
                      role="group"
                      aria-labelledby="select-color-label"
                      className={`scroll-mt-36 rounded-xl transition-all duration-200 ${
                        missingFieldKey === "color"
                          ? "ring-2 ring-red-400 bg-red-50/50 p-3 -mx-3"
                          : ""
                      }`}
                    >
                      <p
                        id="select-color-label"
                        className="font-medium text-gray-900 mb-2"
                      >
                        Select Color
                        {color && (
                          <span className="ml-2 text-sm font-semibold text-[#691110]">
                            — {color}
                          </span>
                        )}
                      </p>
                      <div className="flex gap-2.5 flex-wrap">
                        {availableColors.map((item, index) => (
                          <button
                            type="button"
                            aria-pressed={item === color}
                            disabled={productData.soldOut}
                            onClick={() => {
                              setColor(item);
                              if (
                                missingFieldKey === "color" ||
                                (missingFieldKey === "customColor" &&
                                  !isCustomColor(item))
                              ) {
                                setMissingFieldKey("");
                              }
                              setFormError("");
                              if (!isCustomColor(item)) {
                                setNote("");
                              }
                            }}
                            key={index}
                            className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#691110] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                              item === color
                                ? "border-[#691110] bg-red-50 text-[#691110]"
                                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                            } ${isCustomColor(item) ? "italic border-[#691110]/60" : ""}`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                      {missingFieldKey === "color" && (
                        <p className="text-xs font-medium text-red-600 mt-2">
                          Please select a color to continue.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Custom Color Note */}
                  {isCustom && (
                    <div
                      ref={customColorSectionRef}
                      className={`scroll-mt-36 rounded-xl transition-all duration-200 ${
                        missingFieldKey === "customColor"
                          ? "ring-2 ring-red-400 bg-red-50/50 p-3 -mx-3"
                          : ""
                      }`}
                    >
                      <label
                        htmlFor="custom-color-note"
                        className="block font-medium text-gray-900"
                      >
                        Custom Color
                      </label>
                      <p className="mb-2 text-xs sm:text-sm text-gray-600">
                        Custom color attracts an additional fee of {currency}
                        {convertPrice(CUSTOM_COLOR_FEE)}.
                      </p>
                      <input
                        ref={customColorInputRef}
                        type="text"
                        name="customColorNote"
                        id="custom-color-note"
                        disabled={productData.soldOut}
                        placeholder="In what stunning color do you want your piece?"
                        className="px-4 py-2.5 rounded-lg border-2 transition-all duration-200 text-sm sm:text-base font-medium text-gray-800 focus:outline-none focus:border-[#691110] border-gray-300 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                        value={note}
                        onChange={(e) => {
                          const val = e.target.value;
                          setNote(val);
                          if (val.trim()) {
                            if (missingFieldKey === "customColor") {
                              setMissingFieldKey("");
                            }
                            setFormError("");
                          }
                        }}
                      />
                      {missingFieldKey === "customColor" && (
                        <p className="text-xs font-medium text-red-600 mt-2">
                          Please specify your preferred custom color.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Fit Length Selection */}
                  {availableFitLengths.length > 0 && (
                    <div
                      ref={fitLengthSectionRef}
                      role="group"
                      aria-labelledby="select-length-label"
                      className={`scroll-mt-36 rounded-xl transition-all duration-200 ${
                        missingFieldKey === "fitLength"
                          ? "ring-2 ring-red-400 bg-red-50/50 p-3 -mx-3"
                          : ""
                      }`}
                    >
                      <p
                        id="select-length-label"
                        className="font-medium text-gray-900 mb-2"
                      >
                        Select Length
                        {fitLength && (
                          <span className="ml-2 text-sm font-semibold text-[#691110]">
                            — {fitLength}
                          </span>
                        )}
                      </p>
                      <div className="flex flex-wrap gap-2 text-xs text-gray-600 mb-2.5">
                        {HEIGHT_FIT_GUIDE.map((item) => (
                          <span
                            key={item.label}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100"
                          >
                            <strong className="text-gray-800">
                              {item.label}:
                            </strong>
                            <span>{item.range}</span>
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2.5 flex-wrap">
                        {availableFitLengths.map((item, index) => (
                          <button
                            type="button"
                            aria-pressed={item === fitLength}
                            disabled={productData.soldOut}
                            onClick={() => {
                              setFitLength(item);
                              if (missingFieldKey === "fitLength") {
                                setMissingFieldKey("");
                              }
                              setFormError("");
                            }}
                            key={index}
                            className={`px-4 py-2 rounded-lg border-2 transition-all duration-200 font-semibold focus:outline-none focus-visible:ring-2 focus-visible:ring-[#691110] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                              item === fitLength
                                ? "border-[#691110] bg-red-50 text-[#691110]"
                                : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400"
                            }`}
                          >
                            {item}
                          </button>
                        ))}
                      </div>
                      {missingFieldKey === "fitLength" && (
                        <p className="text-xs font-medium text-red-600 mt-2">
                          Please select a fit length to continue.
                        </p>
                      )}
                    </div>
                  )}

                  {/* Collapsible Optional Body Measurements */}
                  {requiresMeasurements && (
                    <div className="border border-gray-200 rounded-xl overflow-hidden bg-gray-50/60">
                      <button
                        type="button"
                        aria-expanded={showMeasurements}
                        onClick={() => setShowMeasurements((prev) => !prev)}
                        className="w-full px-4 py-3 flex items-center justify-between gap-3 text-left hover:bg-gray-100/70 transition cursor-pointer"
                      >
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-sm text-gray-900">
                              Custom Body Measurements (Optional)
                            </span>
                            {enteredMeasurementCount > 0 && (
                              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-red-100 text-[#691110]">
                                {enteredMeasurementCount} entered
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-600 mt-0.5">
                            Standard sizing for your selected size is used if
                            left blank.
                          </p>
                        </div>
                        {showMeasurements ? (
                          <LuChevronUp className="w-5 h-5 text-gray-600 shrink-0" />
                        ) : (
                          <LuChevronDown className="w-5 h-5 text-gray-600 shrink-0" />
                        )}
                      </button>

                      {showMeasurements && (
                        <div className="px-4 pb-4 pt-2 border-t border-gray-200 bg-white space-y-4">
                          {availableFitLengths.length === 0 && (
                            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                              {HEIGHT_FIT_GUIDE.map((item) => (
                                <span
                                  key={item.label}
                                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-gray-100"
                                >
                                  <strong className="text-gray-800">
                                    {item.label}:
                                  </strong>
                                  <span>{item.range}</span>
                                </span>
                              ))}
                            </div>
                          )}

                          <div className="p-3 border-l-4 border-[#691110] bg-red-50 text-red-900 rounded-r-md text-xs sm:text-sm">
                            <p className="mb-1">
                              Enter your exact measurements for a tailored fit,
                              or leave blank to use standard sizing.
                            </p>
                            <a
                              onClick={(e) => scrollToTab(e, "size-guide")}
                              href="#description"
                              className="underline font-medium text-[#691110] hover:text-red-700"
                            >
                              View our Size Guide
                            </a>
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                            {MEASUREMENT_FIELDS.map((field) => (
                              <div key={field.name}>
                                <label
                                  htmlFor={`measurement-${field.name}`}
                                  className="block text-xs font-medium text-gray-700 mb-1"
                                >
                                  {field.label}
                                </label>
                                <input
                                  id={`measurement-${field.name}`}
                                  type="number"
                                  step="any"
                                  inputMode="decimal"
                                  name={field.name}
                                  disabled={productData.soldOut}
                                  value={measurements[field.name]}
                                  onChange={handleMeasurementChange}
                                  onWheel={(e) => e.currentTarget.blur()}
                                  placeholder={field.placeholder}
                                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-200 focus:border-[#691110] disabled:opacity-50"
                                  min={0}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-4">
                    <span className="font-medium text-gray-900">Quantity:</span>
                    <div className="inline-flex items-center gap-3">
                      <button
                        type="button"
                        disabled={productData.soldOut || quantity <= 1}
                        onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                        aria-label="Decrease quantity"
                        className="w-8 h-8 rounded-full bg-gray-200 text-xl font-bold flex items-center justify-center hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        -
                      </button>
                      <span className="text-lg font-semibold w-8 text-center">
                        {quantity}
                      </span>
                      <button
                        type="button"
                        disabled={productData.soldOut}
                        onClick={() => setQuantity((q) => q + 1)}
                        aria-label="Increase quantity"
                        className="w-8 h-8 rounded-full bg-gray-200 text-xl font-bold flex items-center justify-center hover:bg-red-100 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Sticky Mobile / Static Desktop Purchase Bar */}
                  <div className="fixed md:static bottom-0 left-0 w-full bg-white md:bg-transparent p-4 md:p-0 border-t md:border-none border-gray-200 shadow-[0_-4px_10px_-2px_rgba(0,0,0,0.1)] md:shadow-none z-30 md:z-auto flex flex-col gap-2">
                    {formError && (
                      <div
                        role="alert"
                        className="flex items-center justify-center md:justify-start gap-1.5 text-red-600 font-semibold text-sm"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth={2}
                          stroke="currentColor"
                          aria-hidden="true"
                          className="w-4 h-4 shrink-0"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        <p>{formError}</p>
                      </div>
                    )}
                    {!productData.soldOut &&
                      (totalUnitFees > 0 || quantity > 1) && (
                        <div className="flex items-center justify-between md:justify-start md:gap-2 text-sm text-gray-700 font-medium">
                          <span>
                            Total{quantity > 1 ? ` (${quantity} items)` : ""}:
                          </span>
                          <span className="text-base font-bold text-[#691110] inline-flex items-center">
                            {currency}
                            {convertPrice(lineTotalPrice)}
                          </span>
                        </div>
                      )}
                    <div className="flex items-center gap-3 justify-center md:justify-start w-full">
                      <button
                        type="submit"
                        disabled={productData.soldOut}
                        className={`flex-1 md:flex-none w-full md:w-auto px-8 py-3.5 md:py-3 rounded-xl text-lg font-bold shadow-lg transition-all duration-200 active:scale-95 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed disabled:active:scale-100 ${
                          !productData.soldOut && missingOption
                            ? "bg-gray-900 hover:bg-gray-800 text-white"
                            : "bg-gradient-to-r from-[#691110] to-red-700 hover:from-red-800 hover:to-red-600 text-white"
                        }`}
                      >
                        {ctaLabel}
                      </button>
                      <button
                        type="button"
                        onClick={() => addToWishlist(productData._id)}
                        aria-label={
                          isWishlisted
                            ? "Remove from Wishlist"
                            : "Add to Wishlist"
                        }
                        aria-pressed={isWishlisted}
                        title={
                          isWishlisted
                            ? "Remove from Wishlist"
                            : "Add to Wishlist"
                        }
                        className={`p-3.5 md:p-3 rounded-xl border-2 transition-all flex items-center justify-center shrink-0 cursor-pointer ${
                          isWishlisted
                            ? "border-red-600 bg-red-50 text-red-600"
                            : "border-gray-300 bg-white text-gray-500 hover:border-gray-400"
                        }`}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill={isWishlisted ? "currentColor" : "none"}
                          viewBox="0 0 24 24"
                          strokeWidth={1.5}
                          stroke="currentColor"
                          aria-hidden="true"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </form>
              </div>

              {/* Trust Indicators */}
              <div className="border-t pt-6 mt-4 text-sm text-gray-600 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                  <div className="bg-green-50 p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      aria-hidden="true"
                      className="w-5 h-5 text-green-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z"
                      />
                    </svg>
                  </div>
                  <p className="font-medium">100% Original Product</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-blue-50 p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      aria-hidden="true"
                      className="w-5 h-5 text-blue-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"
                      />
                    </svg>
                  </div>
                  <p className="font-medium">Secure Online Payment</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-orange-50 p-2 rounded-full">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                      stroke="currentColor"
                      aria-hidden="true"
                      className="w-5 h-5 text-orange-600"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium">
                      {productData.preorder && !productData.soldOut
                        ? "Preorder: ships once item becomes available"
                        : productData.section !== "Still Her"
                          ? "7-10 working days production time"
                          : "Delivery in 3-5 working days"}
                    </p>
                    <Link
                      to="/shipping-policy"
                      className="text-xs text-[#691110] underline hover:text-red-700"
                    >
                      Shipping & delivery policy
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p className="text-center pt-10 text-sm text-gray-500">
            Aesthesia- Where women see themselves again.
          </p>
        </div>

        {/* Description & Size Guide Tabs */}
        <div
          ref={descriptionSectionRef}
          id="description"
          className="max-w-6xl mx-auto mt-12 bg-white rounded-2xl shadow-lg p-6 sm:p-8 scroll-mt-32"
        >
          <div
            role="tablist"
            aria-label="Product information tabs"
            className="flex gap-6 border-b border-gray-200 mb-6"
          >
            {tabs.map((tab) => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                role="tab"
                type="button"
                aria-selected={tab.id === activeTab}
                aria-controls={`tabpanel-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-3 -mb-px text-base sm:text-lg font-medium cursor-pointer border-b-2 transition-colors ${
                  tab.id === activeTab
                    ? "text-[#691110] border-[#691110]"
                    : "text-gray-600 border-transparent hover:text-gray-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
          <div
            id={`tabpanel-${activeTab}`}
            role="tabpanel"
            aria-labelledby={`tab-${activeTab}`}
            className="text-gray-600 text-base sm:text-lg leading-relaxed"
          >
            {renderTabContent()}
          </div>
        </div>

        {/* Reviews */}
        <div
          id="reviews-section"
          className="max-w-6xl mx-auto px-4 mt-12 scroll-mt-32"
        >
          <ProductReview reviews={displayedReviews} />
        </div>

        {/* Related Products */}
        <div className="max-w-6xl mx-auto px-4 mt-12 pb-32 md:pb-0">
          <RelatedProducts
            section={productData.section}
            currentProductId={productData._id}
          />
        </div>
      </div>

      <ProductImageLightbox
        isOpen={isSizeGuideOpen || isImageModalOpen}
        images={isSizeGuideOpen ? [{ url: assets.size_chart }] : productImages}
        currentIndex={isSizeGuideOpen ? 0 : activeImageIndex}
        productName={
          isSizeGuideOpen ? "Aesthesia Size Guide" : productData.name
        }
        onClose={isSizeGuideOpen ? closeSizeGuideModal : closeImageModal}
        onSelectIndex={isSizeGuideOpen ? () => {} : setSelectedImageIndex}
      />

      <AddedToCartModal
        summary={addedToCartSummary}
        currency={currency}
        convertPrice={convertPrice}
        onContinueShopping={closeAddedModal}
        onGoToCart={() => {
          setAddedToCartSummary(null);
          navigate("/cart");
        }}
      />
    </div>
  );
};

export default Product;
