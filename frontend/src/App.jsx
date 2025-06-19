import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Collection from "./pages/Collection";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Product from "./pages/Product";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Cart from "./pages/Cart";
import Footer from "./components/Footer";
import Clothings from "./pages/Clothings";
import Wigs from "./pages/Wigs";
import RereCollection from "./pages/RereCollection";
import Jewelry from "./pages/Jewelry";
import SearchBar from "./components/SearchBar";
import { ToastContainer } from "react-toastify";
import Wishlist from "./pages/Wishlist";

const App = () => {
  const navigate = useNavigate();
  const isHome = location.pathname === "/";
  const isClothing = location.pathname === "/clothing";
  const isWig = location.pathname === "/wigs";
  const isRere = location.pathname === "/rere-collection";
  const isJewelry = location.pathname === "/jewelry";

  return (
    <div>
      <ToastContainer />
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
            <Route path="/login" element={<Login />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/wishlist" element={<Wishlist />} />
          </Routes>
        </div>
      )}
      <Footer />
    </div>
  );
};

export default App;
