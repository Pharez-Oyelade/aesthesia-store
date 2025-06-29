import React from "react";
import axios from "axios";
import { useState } from "react";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Login = ({ setToken }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const response = await axios.post(backendUrl + "/api/user/admin", {
        email,
        password,
      });
      if (response.data.success) {
        setToken(response.data.token);
      } else {
        // alert("Invalid email or password");
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-gray-100">
      <div className="bg-white shadow-xl rounded-2xl px-10 py-8 max-w-md w-full border border-gray-100">
        <h1 className="text-3xl font-bold mb-6 text-red-700">Admin Panel</h1>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Email Address
            </label>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className="rounded-lg w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-red-200 outline-none transition"
              type="email"
              placeholder="example@email.com"
              required
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Password
            </label>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className="rounded-lg w-full px-4 py-2 border border-gray-300 focus:ring-2 focus:ring-red-200 outline-none transition"
              type="password"
              placeholder="********"
              required
            />
          </div>
          <button
            className="w-full py-3 rounded-lg text-white bg-red-700 hover:bg-red-800 font-semibold text-lg shadow transition"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
