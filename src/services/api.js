import axios from "axios";

// Dev: use Vite proxy (same-origin) to avoid CORS.
// Prod: default to Spring Boot base URL unless overridden.
const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://aurum-backend-vd0a.onrender.com";

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor — attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      const cleanedToken = token.replace(/^Bearer\s+/i, "");
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${cleanedToken}`;
      config.withCredentials = false;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor — handle 401 globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ─── Auth ───────────────────────────────────────────────────────────────────
export const signup = (data) => api.post("/api/v1/auth/signup", data);
export const login = (data) => api.post("/api/v1/auth/login", data);

// ─── Portfolio ───────────────────────────────────────────────────────────────
export const getPortfolioSummary = () =>
  api.get("/api/v1/transactions/portfolio/summary");

export const getHoldings = () =>
  api.get("/api/v1/transactions/portfolio/holdings");

// ─── SIP ─────────────────────────────────────────────────────────────────────
export const getSipSummary = () => api.get("/api/v1/sip/summary");

export const getSips = () => api.get("/api/v1/sip");

export const createSip = (data) => api.post("/api/v1/sip", data);

export const getAiInsights = () => api.get("/api/v1/sip/ai-insights");

export default api;
