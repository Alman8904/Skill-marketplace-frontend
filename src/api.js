import axios from "axios";

// In dev: use empty baseURL so Vite proxy forwards requests (avoids CORS)
// In prod: use full backend URL from environment or fallback
const API_BASE_URL = import.meta.env.PROD
  ? import.meta.env.VITE_API_URL || "https://skill-marketplace.onrender.com"
  : "";

const api = axios.create({
  baseURL: API_BASE_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let isRedirecting = false;

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (
      error.response &&
      (error.response.status === 401 || error.response.status === 403)
    ) {
      // Prevent multiple simultaneous redirects
      if (!isRedirecting && window.location.pathname !== "/login") {
        isRedirecting = true;
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        // Use a delay to avoid redirect loops
        setTimeout(() => {
          window.location.href = "/login";
          isRedirecting = false;
        }, 100);
      }
    }
    return Promise.reject(error);
  },
);

export default api;
