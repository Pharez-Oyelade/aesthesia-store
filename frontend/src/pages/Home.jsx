import React from "react";
import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import FeaturedGrid from "../components/FeaturedGrid";
import NewProducts from "../components/NewProducts";
import Policy from "../components/Policy";
import NewsletterBox from "../components/NewsletterBox";
import Title from "../components/Title";

const Home = () => {
  return (
    <div className="">
      <Hero />
      <div className="text-center mt-20 border-y-2 w-[75%] m-auto py-10">
        <div className="text-2xl sm:text-3xl">
          <Title text1={"Modern Elegance"} text2={"Meets Timeless Style"} />
        </div>

        <p className="text-xl w-full">
          At <span className="text-red-700">Aesthesia</span>, we curate fashion
          that inspires self-expression, confidence, and creativity, <br />{" "}
          because your style should speak before you do...{" "}
        </p>
        <Link to="/about">
          <p className="text-red-500 pt-5 cursor-pointer">About Us</p>
        </Link>
      </div>
      <NewProducts />
      <Policy />
      <FeaturedGrid />
      <div className="px-4">
        <NewsletterBox />
      </div>
    </div>
  );
};

export default Home;
