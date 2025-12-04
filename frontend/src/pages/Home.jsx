import React from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import FeaturedGrid from "../components/FeaturedGrid";
import NewProducts from "../components/NewProducts";
import Policy from "../components/Policy";
import NewsletterBox from "../components/NewsletterBox";
import Title from "../components/Title";
import PromotionBanner from "../components/PromotionBanner";
import Reviews from "../components/Reviews";
import { assets } from "../assets/assets";

const Home = () => {
  return (
    <div className="">
      <Hero />
      <div>{/* <PromotionBanner /> */}</div>
      <div>
        <div className="text-center mt-20 border-y-2 w-[75%] m-auto py-10">
          <div className="text-2xl sm:text-3xl">
            <Title
              text1={"Welcome Home -"}
              text2={"To Confidence, beauty, and You"}
            />
          </div>

          <p className="text-xl w-full">
            At <span className="text-red-800">Aesthesia</span>, We design with
            feeling — pieces and products that carry softness and strength,
            elegance and ease. Each one made to remind you of who you’ve always
            been beneath the noise. Because beauty isn’t about becoming someone
            new — it’s about coming home to yourself.{" "}
          </p>
          <Link to="/about">
            <p className="text-red-700 pt-5 cursor-pointer">About Us</p>
          </Link>
        </div>
      </div>

      <NewProducts />
      <Policy />

      <FeaturedGrid />
      <Reviews />
      {/* Why choose us */}
      <div className="flex justify-center items-center gap-3 sm:gap-10 mt-10 mb-20">
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-60 text-center">
          <img src={assets.badge} alt="Premium quality" className="w-10" />
          <h3 className="font-semibold text-lg">Premium Quality</h3>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-60 text-center">
          <img src={assets.reliability} alt="Reliability" className="w-10" />
          <h3 className="font-semibold text-lg">Reliable Delivery</h3>
        </div>
        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 w-60 text-center">
          <img
            src={assets.secure_payment}
            alt="secure-checkout"
            className="w-10"
          />
          <h3 className="font-semibold text-lg">Secure Checkout</h3>
        </div>
      </div>
      <div className="px-4">
        <NewsletterBox />
      </div>
    </div>
  );
};

export default Home;
