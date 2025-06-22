import React from "react";
import Hero from "../components/Hero";
import FeaturedGrid from "../components/FeaturedGrid";
import NewProducts from "../components/NewProducts";
import Policy from "../components/Policy";
import NewsletterBox from "../components/NewsletterBox";

const Home = () => {
  return (
    <div className="">
      <Hero />
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
