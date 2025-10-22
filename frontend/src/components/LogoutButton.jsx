import React, { useContext } from "react";
import { shopContext } from "../context/ShopContext";
import { toast } from "react-toastify";

const LogoutButton = () => {
  const { logout } = useContext(shopContext);

  const handleLogout = async () => {
    if (window.confirm("Are you sure you want to logout?")) {
      try {
        await logout();
        toast.success("Logged out successfully");
      } catch (error) {
        console.log("Logout error:", error);
        toast.error("Logout failed. Please try again.");
      }
    }
  };

  return (
    <p onClick={handleLogout} className="cursor-pointer hover:text-black">
      Logout
    </p>
  );
};

export default LogoutButton;
