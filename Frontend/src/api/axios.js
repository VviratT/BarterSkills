// src/api/axios.js
import axios from "axios";

// 1. Create the instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// 2. Attach access token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 3. On 401, call /refresh-token (with HTTP‑only cookie), store new token, retry original
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config;
    if (
      error.response?.status === 401 &&
      !original._retry
    ) {
      original._retry = true;
      try {
        // refreshToken is sent via cookie
        const refreshRes = await axios.post(
          `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/users/refresh-token`,
          {},
          { withCredentials: true }
        );
        const { accessToken } = refreshRes.data;
        localStorage.setItem("accessToken", accessToken);
        original.headers.Authorization = `Bearer ${accessToken}`;
        return api(original);
      } catch (refreshErr) {
        // if refresh also fails, redirect to login or clear auth
        localStorage.removeItem("accessToken");
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
