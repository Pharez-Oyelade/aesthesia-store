import axios from "axios";
import React, { useEffect, useState } from "react";
import { backendUrl, currency } from "../App";
import { toast } from "react-toastify";

const List = ({ token }) => {
  const [list, setList] = useState([]);

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

  const deleteProduct = async (id) => {
    try {
      const response = await axios.post(
        backendUrl + "/api/product/remove",
        { id },
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
  };

  useEffect(() => {
    fetchList();
  }, []);

  return (
    <>
      <div className="bg-white shadow-xl rounded-2xl p-8 border border-gray-100">
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
                onClick={() => deleteProduct(item._id)}
                className="text-center text-lg bg-red-100 text-red-700 rounded-full px-4 py-1 font-bold hover:bg-red-200 transition"
              >
                X
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default List;
