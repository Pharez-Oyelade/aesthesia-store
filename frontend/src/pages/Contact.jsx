import React from "react";
import Title from "../components/Title";
import { assets } from "../assets/assets";
import NewsletterBox from "../components/NewsletterBox";

const Contact = () => {
  return (
    <div className="">
      <div className="text-center text-2xl pt-10 border-t">
        <Title text1={"CONTACT"} text2={"US"} />
      </div>

      <div className="my-10 flex flex-col justify-center md:flex-row gap-10 mb-28">
        <img
          src={assets.contact_img}
          className="w-full md:max-w-[480px]"
          alt=""
        />
        <div className="flex flex-col justify-center items-start gap-6">
          <p className="font-semibold text-xl text-gray600">Our Store</p>
          <p className="text-gray-500">
            45678 Filmore Street <br /> Block A2, George, AX
          </p>
          <p className="text-gray-500">
            Tel: 7688 4848 848 <br /> Email: tyuoe@aesthesia.com
          </p>
          <p className="font-semibold text-xl text-gray-600">
            Careers at Aesthesia
          </p>
          <p className="text-gray-500">
            Learn more about our teams and job openings
          </p>
          <button className="border border-black px-8 py-4 text-sm hover:bg-red-800 hover:text-white transition-all duration-500">
            Explore
          </button>
        </div>
      </div>

      <NewsletterBox />
    </div>
  );
};

export default Contact;
