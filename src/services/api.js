import axios from "axios";

// ✅ ONLY use env variable (no hardcoded fallback)
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

if (!BASE_URL) {
  console.error("❌ VITE_API_BASE_URL is NOT defined");
}

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// ✅ Attach token properly
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Handle 401
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

api.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

// ─── API Calls ───
export const signup = (data) => api.post("/api/v1/auth/signup", data);
export const login = (data) => api.post("/api/v1/auth/login", data);

export const getPortfolioSummary = () =>
  api.get("/api/v1/transactions/portfolio/summary");

export const getHoldings = () =>
  api.get("/api/v1/transactions/portfolio/holdings");

export const getSipSummary = () => api.get("/api/v1/sip/summary");
export const getSips = () => api.get("/api/v1/sip");
export const createSip = (data) => api.post("/api/v1/sip", data);
export const getAiInsights = () => api.get("/api/v1/sip/ai-insights");

export default api;