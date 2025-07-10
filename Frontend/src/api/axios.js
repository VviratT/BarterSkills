// src/api/axios.js
import axios from "axios";

// ensure cookies (refresh‑token) are sent
axios.defaults.withCredentials = true;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("accessToken");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config;

    // if it’s NOT our refresh endpoint, and it’s a 401, and we haven’t tried to refresh yet:
    if (
      err.response?.status === 401 &&
      !original._retry &&
      !original.url?.endsWith("/users/refresh-token")
    ) {
      original._retry = true;
      try {
        // call refresh on the same `api` instance so baseURL is correct
        const { data } = await api.post("/users/refresh-token", {});
        localStorage.setItem("accessToken", data.accessToken);
        // update header and retry original
        original.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(original);
      } catch (refreshErr) {
        // if refresh also 401s, or any error, we give up
        return Promise.reject(refreshErr);
      }
    }

    return Promise.reject(err);
  }
);

export default api;
