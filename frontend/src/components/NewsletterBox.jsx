import React from "react";
import Title from "./Title";
import { FaLongArrowAltRight } from "react-icons/fa";

const NewsletterBox = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };
  return (
    <div className="text-center py-10">
      <h1 className="font-bold text-3xl mb-3">Join Our List</h1>
      <p className="text-2xl font-medium text-gray-800">
        Signup to be the first to hear about exclusive deals
      </p>

      <form
        onSubmit={handleSubmit}
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3"
      >
        <input
          type="email"
          className="sm:flex-1 outline-none"
          placeholder="Enter Email"
          required
        />

        <button
          type="submit"
          className="bg-red-900 text-white text-md cursor-pointer px-10 py-4 group flex items-center gap-2"
        >
          Subscribe
          <span className="hidden group-hover:block  transition-all">
            <FaLongArrowAltRight />
          </span>
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
