import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const fetchList = async () => {
    try {
      const response = await axios.get(backendUrl + "/api/product/list");
      if (response.data.success) {
        setList(response.data.products);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!selectedProduct) return;
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id: selectedProduct._id },
        { headers: { token } }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        await fetchList();
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
    setShowConfirm(false);
    setSelectedProduct(null);
  };

  const cancelDelete = () => {
    setShowConfirm(false);
    setSelectedProduct(null);
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100 mx-[30%] w-full">
        <p className="mb-4 text-2xl font-bold text-red-700">
          All Products List
        </p>
        <div className="flex flex-col gap-2">
          <div className="hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-2 px-4 border-b border-gray-200 bg-gray-50 text-base font-semibold text-gray-700 rounded-t-xl">
            <b>Image</b>
            <b>Name</b>
            <b>Section</b>
            <b>Price</b>
            <b className="text-center">Action</b>
          </div>
          {list.map((item, index) => (
            <div
              className="grid grid-cols-[1fr] md:grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-3 px-4 border-b border-gray-100 text-base bg-white hover:bg-gray-50 transition rounded-xl border-2"
              key={index}
            >
              <img
                className="w-14 h-14 object-cover rounded-lg border"
                src={item.image[0]}
                alt=""
              />
              <p className="font-medium">{item.name}</p>
              <p>{item.section}</p>
              <p className="flex items-center gap-1 font-semibold text-red-700">
                {currency}
                {item.price}
              </p>
              <button
                onClick={() => handleDeleteClick(item)}
                className="text-center text-lg bg-red-100 text-red-700 rounded-full px-4 py-1 font-bold hover:bg-red-200 transition"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Confirmation Dialog */}
      {showConfirm && selectedProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm flex flex-col items-center">
            <img
              src={selectedProduct.image[0]}
              alt={selectedProduct.name}
              className="w-20 h-20 object-cover rounded-xl mb-4 border"
            />
            <p className="text-lg font-semibold text-gray-800 mb-2">
              Remove{" "}
              <span className="text-red-700">{selectedProduct.name}</span>?
            </p>
            <p className="text-gray-600 mb-6 text-center">
              Are you sure you want to delete this product? This action cannot
              be undone.
            </p>
            <div className="flex gap-4 w-full">
              <button
                onClick={confirmDelete}
                className="flex-1 py-2 rounded-lg bg-red-700 text-white font-bold hover:bg-red-800 transition"
              >
                Yes, Remove
              </button>
              <button
                onClick={cancelDelete}
                className="flex-1 py-2 rounded-lg bg-gray-200 text-gray-700 font-semibold hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default List;
