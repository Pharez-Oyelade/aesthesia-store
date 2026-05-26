import React, { lazy, Suspense, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "./components/ScrollToTop";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from "react-toastify";
import NotFound from "./pages/NotFound";
import MetaPageTracker from "./components/MetaPageTracker";
import InstagramIcon from "./components/InstagramIcon";
import WaitlistPopup from "./components/waitlistPopup";
import { isDiscountWaitlistEnabled } from "./config/features";

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
  const { pathname } = useLocation();
  const isHome = pathname === "/";
  const isClothing = pathname === "/clothing";
  const isWig = pathname === "/wigs";
  const isRere = pathname === "/rere-collection";
  const isJewelry = pathname === "/jewelry";

  useEffect(() => {
    // Defer Clarity until browser is idle to keep it off the critical path.
    // This prevents it from affecting LCP / FID on Lighthouse audits.
    const loadClarity = () => {
      if (window.clarity) return;
      (function (c, l, a, r, i, t, y) {
        c[a] =
          c[a] ||
          function () {
            (c[a].q = c[a].q || []).push(arguments);
          };
        t = l.createElement(r);
        t.async = 1;
        t.src = "https://www.clarity.ms/tag/vq4h0d3qnn";
        y = l.getElementsByTagName(r)[0];
        y.parentNode.insertBefore(t, y);
      })(window, document, "clarity", "script", "vq4h0d3qnn");
    };

    if ("requestIdleCallback" in window) {
      const idleId = requestIdleCallback(loadClarity, { timeout: 3000 });
      return () => cancelIdleCallback(idleId);
    } else {
      // Fallback for Safari which doesn't support requestIdleCallback
      const timerId = setTimeout(loadClarity, 3000);
      return () => clearTimeout(timerId);
    }
  }, []);

  return (
    <div className="overflow-x-hidden">
      {isDiscountWaitlistEnabled && <WaitlistPopup />}
      <InstagramIcon />
      <ToastContainer />
      <ScrollToTop />
      <Suspense fallback={<LoadingFallback />}>
        <PreNav />
        <Navbar />
        <SearchBar />
        <MetaPageTracker />
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
