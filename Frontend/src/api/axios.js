import axios from "axios";

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
    if (err.response?.status === 401 && !original._retry) {
      original._retry = true;
      const { data } = await axios.post(
        `${import.meta.env.VITE_API_URL || "http://localhost:8000"}/api/v1/users/refresh-token`,
        {},
        { withCredentials: true }
      );
      localStorage.setItem("accessToken", data.accessToken);
      original.headers.Authorization = `Bearer ${data.accessToken}`;
      return api(original);
    }
    return Promise.reject(err);
  }
);

export default api;
