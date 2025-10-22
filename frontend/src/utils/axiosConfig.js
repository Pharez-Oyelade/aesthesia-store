import axios from "axios";
import { toast } from "react-toastify";

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.token = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      // Don't show error toast if we're already on login page
      if (window.location.pathname !== "/login") {
        // Token expired or invalid
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        toast.error("Session expired. Please login again.");

        // Redirect to login after a short delay
        setTimeout(() => {
          window.location.href = "/login";
        }, 1500);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
