import axios from "axios";

// Default backend API URL
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("hiremate-token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle session expiration (401 Unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect if token is invalid
      localStorage.removeItem("hiremate-token");
      localStorage.removeItem("hiremate-user");
      
      // Prevent infinite reload loops on login/register pages
      const path = window.location.pathname;
      if (path !== "/login" && path !== "/register" && path !== "/forgot-password" && path !== "/reset-password") {
        window.location.href = "/login?expired=true";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
