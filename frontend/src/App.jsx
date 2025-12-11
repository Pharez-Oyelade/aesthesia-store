import React, { lazy, Suspense } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from "react-toastify";
import NotFound from "./pages/NotFound";

// Lazy load all page components for code splitting
const Home = lazy(() => import("./pages/Home"));
const Collection = lazy(() => import("./pages/Collection"));
const About = lazy(() => import("./pages/About"));
const Contact = lazy(() => import("./pages/Contact"));
const Product = lazy(() => import("./pages/Product"));
const Login = lazy(() => import("./pages/Login"));
const Cart = lazy(() => import("./pages/Cart"));
const Clothings = lazy(() => import("./pages/Clothings"));
const Wigs = lazy(() => import("./pages/Wigs"));
const RereCollection = lazy(() => import("./pages/RereCollection"));
const Jewelry = lazy(() => import("./pages/Jewelry"));
const Wishlist = lazy(() => import("./pages/Wishlist"));
const PlaceOrder = lazy(() => import("./pages/PlaceOrder"));
const Orders = lazy(() => import("./pages/Orders"));
const Profile = lazy(() => import("./pages/Profile"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));
const PreNav = lazy(() => import("./components/Prenav"));
const CollectionPage = lazy(() => import("./pages/CollectionPage"));
const ShippingPolicy = lazy(() => import("./pages/ShippingPolicy"));

// Loading component for fallback
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
);

const App = () => {
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const isClothing = location.pathname === "/clothing";
  const isWig = location.pathname === "/wigs";
  const isRere = location.pathname === "/rere-collection";
  const isJewelry = location.pathname === "/jewelry";

  return (
    <div className="overflow-x-hidden">
      <ToastContainer />
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
        <PreNav />
        <Navbar />
        <SearchBar />
        {isHome || isClothing || isWig || isRere || isJewelry ? (
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/clothing" element={<Clothings />} />
            <Route path="/wigs" element={<Wigs />} />
            <Route path="/rere-collection" element={<RereCollection />} />
            <Route path="/jewelry" element={<Jewelry />} />
          </Routes>
        ) : (
          <div className="px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw] mt-20 pt-10">
            <Routes>
              <Route path="/collection" element={<Collection />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/product/:productId" element={<Product />} />
              <Route
                path="/collection/:sectionName"
                element={<CollectionPage />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/place-order" element={<PlaceOrder />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/shipping-policy" element={<ShippingPolicy />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        )}
        <Footer />
      </Suspense>
    </div>
  );
};

export default App;
