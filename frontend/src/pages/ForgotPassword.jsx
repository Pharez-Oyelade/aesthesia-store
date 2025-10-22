import React, { useState, useContext } from "react";
import { shopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const { backendUrl } = useContext(shopContext);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await axios.post(backendUrl + "/api/user/forgot-password", {
        email,
      });
      if (res.data.success) toast.success("Reset link sent to your email.");
      else toast.error(res.data.message);
      setLoading(false);
    } catch {
      toast.error("Error sending reset email.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-20 flex flex-col gap-4"
    >
      <h2 className="text-2xl font-bold mb-2">Forgot Password</h2>
      <input
        type="email"
        className="border px-3 py-2"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      <button
        className={`bg-red-600 text-white px-4 py-2 rounded cursor-pointer ${
          loading ? "disabled" : ""
        }`}
      >
        {/* Send Reset Link */}
        {loading ? "Loading..." : "Send Reset Link"}
      </button>
    </form>
  );
};

export default ForgotPassword;
