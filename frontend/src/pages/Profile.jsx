import React, { useEffect, useState, useContext } from "react";
import { shopContext } from "../context/ShopContext";
import { FaRegHeart } from "react-icons/fa6";
import { MdOutlineShoppingCart } from "react-icons/md";
import { IoMdListBox } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Profile = () => {
  const { token, backendUrl } = useContext(shopContext);
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.post(
          backendUrl + "/api/user/details",
          {},
          { headers: { token } }
        );
        if (res.data.success && res.data.user) {
          setUser(res.data.user);
        }
      } catch (err) {
        console.log(err);
      }
      setLoading(false);
    };
    fetchUser();
  }, [token, backendUrl]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="text-lg text-gray-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto mt-16 mb-20 bg-white rounded-3xl shadow-xl p-8 flex flex-col gap-8">
      <div className="flex flex-col items-center gap-2">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-red-700 to-pink-600 flex items-center justify-center text-white text-4xl font-bold shadow">
          {user.name ? user.name[0].toUpperCase() : "U"}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">
          {user.name || "User"}
        </h2>
        <p className="text-gray-500">{user.email || "No email found"}</p>
      </div>

      <div className="flex flex-col gap-4">
        <button
          onClick={() => navigate("/wishlist")}
          className="flex items-center gap-3 px-6 py-3 rounded-xl bg-pink-50 hover:bg-pink-100 text-pink-700 font-semibold text-lg transition"
        >
          <FaRegHeart className="text-2xl" />
          Wishlist
        </button>
        <button
          onClick={() => navigate("/cart")}
          className="flex items-center gap-3 px-6 py-3 rounded-xl bg-green-50 hover:bg-green-100 text-green-700 font-semibold text-lg transition"
        >
          <MdOutlineShoppingCart className="text-2xl" />
          Cart
        </button>
        <button
          onClick={() => navigate("/orders")}
          className="flex items-center gap-3 px-6 py-3 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-semibold text-lg transition"
        >
          <IoMdListBox className="text-2xl" />
          Orders
        </button>
      </div>
    </div>
  );
};

export default Profile;
