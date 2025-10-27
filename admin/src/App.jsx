import React, { useState, useEffect, lazy, Suspense } from "react";
import { TbCurrencyNaira } from "react-icons/tb";

import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";

// Lazy load page components
const Add = lazy(() => import("./pages/Add"));
const List = lazy(() => import("./pages/List"));
const Orders = lazy(() => import("./pages/Orders"));
const Login = lazy(() => import("./components/Login"));
const Section = lazy(() => import("./pages/Section"));

// Loading fallback
const LoadingFallback = () => (
  <div className="flex justify-center items-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
  </div>
);

export const backendUrl = import.meta.env.VITE_BACKEND_URL;
export const currency = <TbCurrencyNaira />;

const App = () => {
  const [token, setToken] = useState(
    localStorage.getItem("token") ? localStorage.getItem("token") : ""
  );

  useEffect(() => {
    localStorage.setItem("token", token);
  }, [token]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <ToastContainer />
      <Suspense fallback={<LoadingFallback />}>
        {token === "" ? (
          <Login setToken={setToken} />
        ) : (
          <>
            <Navbar setToken={setToken} />
            <hr />
            <div className="flex w-full">
              <Sidebar />
              <div className="w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base">
                <Routes>
                  <Route path="/add" element={<Add token={token} />} />
                  <Route path="/list" element={<List token={token} />} />
                  <Route path="/orders" element={<Orders token={token} />} />
                  <Route
                    path="/collections"
                    element={<Section token={token} />}
                  />
                </Routes>
              </div>
            </div>
          </>
        )}
      </Suspense>
    </div>
  );
};

export default App;
