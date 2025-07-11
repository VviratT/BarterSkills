import api from "./api.js";

export const register = data => api.post("/users/register", data);
export const login    = data => api.post("/users/login",    data);
export const logout   = ()   => api.post("/users/logout");

export const refresh  = ()   => {
  const token = localStorage.getItem("refreshToken");
  return api.post("/users/refresh-token", { refreshToken: token });
};

export const me       = ()   => api.get("/users/current-user");

let isRefreshing = false;
let queue = [];

api.interceptors.response.use(
  res => res,
  async err => {
    const orig = err.config;
    if (err.response?.status === 401 && !orig._retry) {
      orig._retry = true;
      if (isRefreshing) {
        return new Promise(resolve =>
          queue.push(token => {
            orig.headers.Authorization = `Bearer ${token}`;
            resolve(api(orig));
          })
        );
      }
      isRefreshing = true;
      try {
        const { data } = await refresh();
        api.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
        orig.headers.Authorization        = `Bearer ${data.accessToken}`;
        queue.forEach(cb => cb(data.accessToken));
        queue = [];
        return api(orig);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(err);
  }
);

export default api;
