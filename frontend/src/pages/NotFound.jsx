import React from "react";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center gap-4">
      <h1 className="text-7xl text-red-900 animate-pulse font-extrabold">
        404
      </h1>
      <p className="text-2xl font-semibold">Page Not Found</p>
      <p className="text-lg">The page you are looking for does not exist.</p>
      <p className="text-lg">Please check the URL and try again.</p>
      <Link
        to="/"
        className="bg-red-900 text-white px-4 py-2 rounded-md hover:bg-red-800"
      >
        Go Home
      </Link>
    </div>
  );
};

export default NotFound;
