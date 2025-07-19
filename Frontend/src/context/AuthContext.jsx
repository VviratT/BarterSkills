
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

// Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Context + Defaults
export const AuthContext = createContext({
  user: null,
  accessToken: null,
  loadingAuth: true,
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  refreshUser: () => Promise.resolve(),
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  // Refresh token + user info on initial load
  useEffect(() => {
    (async () => {
      const storedRT = localStorage.getItem("refreshToken");
      if (!storedRT) {
        setLoadingAuth(false);
        return;
      }

      try {
        const refreshRes = await api.post("/users/refresh-token", {
          refreshToken: storedRT,
        });
        const newAccessToken = refreshRes.data.data.accessToken;

        setAccessToken(newAccessToken);
        api.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        await refreshUser(); // call user fetch
      } catch (err) {
        console.warn("🔄 Refresh failed:", err.message || err);
        localStorage.removeItem("refreshToken");
        delete api.defaults.headers.common["Authorization"];
        setUser(null);
      } finally {
        setLoadingAuth(false);
      }
    })();
  }, []);

  // 🔄 Fetch user details (public method)
  const refreshUser = async () => {
    try {
      const res = await api.get("/users/current-user");
      setUser(res.data.data);
    } catch (err) {
      console.error("Error fetching user:", err);
      setUser(null);
    }
  };

  // Login
  const login = async ({ email, password }) => {
    const res = await api.post("/users/login", { email, password });
    const { accessToken, refreshToken, user: meUser } = res.data.data;

    setAccessToken(accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    setUser(meUser);
  };

  // Register
  const register = async (formData) => {
    const res = await api.post("/users/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const { accessToken, refreshToken, user: meUser } = res.data.data;

    setAccessToken(accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    setUser(meUser);
  };

  // Logout
  const logout = async () => {
    await api.post("/users/logout");
    localStorage.removeItem("refreshToken");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        loadingAuth,
        login,
        register,
        logout,
        refreshUser,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
