import React, { useState, useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { shopContext } from "../context/ShopContext";
import axios from "axios";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const { backendUrl } = useContext(shopContext);
  const navigate = useNavigate();
  const query = new URLSearchParams(useLocation().search);
  const email = query.get("email");
  const token = query.get("token");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirm) return toast.error("Passwords do not match");
    try {
      const res = await axios.post(backendUrl + "/api/user/reset-password", {
        email,
        token,
        password,
      });
      if (res.data.success) {
        toast.success("Password reset successful. Please login.");
        navigate("/login");
      } else {
        toast.error(res.data.message);
      }
    } catch {
      toast.error("Error resetting password.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-sm mx-auto mt-20 flex flex-col gap-4"
    >
      <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
      <input
        type="password"
        className="border px-3 py-2"
        placeholder="New password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      <input
        type="password"
        className="border px-3 py-2"
        placeholder="Confirm new password"
        value={confirm}
        onChange={(e) => setConfirm(e.target.value)}
        required
      />
      <button className="bg-green-600 text-white px-4 py-2 rounded">
        Reset Password
      </button>
    </form>
  );
};

export default ResetPassword;
