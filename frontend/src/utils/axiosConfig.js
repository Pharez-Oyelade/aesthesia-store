import axios from "axios";
import { toast } from "react-toastify";

const handleLogout = () => {
  if (window.location.pathname !== "/login") {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");

    toast.info("Your session has expired. Please log in again.", {
      position: "top-center",
      autoClose: 3000,
      hideProgressBar: false,
    });

    // Save the current URL to redirect back after login
    localStorage.setItem("returnUrl", window.location.pathname);

    // Redirect to login after the toast is shown
    setTimeout(() => {
      window.location.href = "/login";
    }, 1500);
  }
};

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
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (error.response?.data?.code === "TOKEN_EXPIRED") {
        // If we're already refreshing, queue this request
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.token = token;
              return api(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        const refreshToken = localStorage.getItem("refreshToken");

        if (!refreshToken) {
          // No refresh token available, force logout
          handleLogout();
          return Promise.reject(error);
        }

        try {
          const response = await api.post("/api/user/refresh", {
            refreshToken,
          });

          if (response.data.success) {
            localStorage.setItem("token", response.data.token);
            localStorage.setItem("refreshToken", response.data.refreshToken);

            // Update token in pending requests
            originalRequest.headers.token = response.data.token;
            processQueue(null, response.data.token);

            return api(originalRequest);
          } else {
            processQueue(error, null);
            handleLogout();
            return Promise.reject(error);
          }
        } catch (err) {
          processQueue(err, null);
          handleLogout();
          return Promise.reject(err);
        } finally {
          isRefreshing = false;
        }
      } else {
        // Other 401 errors (invalid token, etc)
        handleLogout();
      }
    }

    return Promise.reject(error);
  }
);

export default api;
