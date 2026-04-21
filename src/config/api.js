// API base URL - empty in dev so Vite proxy works, full URL in prod
export const API_BASE_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_API_URL || "https://your-backend-url.com")
  : "";

export const buildUrl = (path) => API_BASE_URL ? `${API_BASE_URL}${path}` : path;