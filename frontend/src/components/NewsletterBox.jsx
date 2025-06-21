import React from "react";

const NewsletterBox = () => {
  const handleSubmit = (e) => {
    e.preventDefault();
  };

  return (
    <div className="text-center">
      <h1 className="font-bold text-3xl mb-3">Join Our List</h1>
      <p className="text-2xl font-medium text-gray-800">
        Signup to be the first to hear about exclusive deals
      </p>
      <form
        className="w-full sm:w-1/2 flex items-center gap-3 mx-auto my-6 border pl-3"
        onSubmit={handleSubmit}
      >
        <input
          className="w-full sm:flex-1 outline-none"
          type="email"
          placeholder="Enter Email"
          required
        />
        <button
          type="submit"
          className="bg-red-800 text-white text-xs px-10 py-4"
        >
          SUBSCRIBE
        </button>
      </form>
    </div>
  );
};

export default NewsletterBox;
