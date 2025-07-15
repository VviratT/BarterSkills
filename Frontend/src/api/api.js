import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// catch 401s and try to refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    // only do this once per request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // use your refresh-token endpoint
        const storedRT = localStorage.getItem("refreshToken");
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL}/users/refresh-token`,
          { refreshToken: storedRT },
          { withCredentials: true }
        );
        const newAccess = data.data.accessToken;
        // update axios defaults & this request
        api.defaults.headers.common["Authorization"] = `Bearer ${newAccess}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccess}`;
        // retry the original request
        return api(originalRequest);
      } catch (refreshErr) {
        // if refresh fails, clear tokens & redirect to login
        localStorage.removeItem("refreshToken");
        delete api.defaults.headers.common["Authorization"];
        window.location.href = "/login";
        return Promise.reject(refreshErr);
      }
    }
    return Promise.reject(error);
  }
);

export default api;


export const toggleSubscribe = (channelId) =>
  api.post(`/subscriptions/c/${channelId}`);
export const getChannelProfile = (username) =>
  api.get(`/users/c/${username}`);

