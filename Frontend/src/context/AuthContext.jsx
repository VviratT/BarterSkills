import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  withCredentials: true,
});

export const AuthContext = createContext({
  user: null,
  accessToken: null,
  loadingAuth: true,
  login: () => Promise.resolve(),
  register: () => Promise.resolve(),
  logout: () => Promise.resolve(),
});
const fetchUser = async () => {
  const res = await api.get("/users/me"); 
  setUser(res.data);
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    (async () => {
      const storedRT = localStorage.getItem("refreshToken");
      if (!storedRT) {
        setLoadingAuth(false);
        return;
      }

      try {
        const refreshRes = await API.post("/users/refresh-token", {
          refreshToken: storedRT,
        });
        const newAccessToken = refreshRes.data.data.accessToken;
        setAccessToken(newAccessToken);
        API.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;

        const meRes = await API.get("/users/current-user");
        setUser(meRes.data.data);
      } catch (err) {
        console.warn("🔄 Refresh failed:", err.message || err);
        localStorage.removeItem("refreshToken");
        delete API.defaults.headers.common["Authorization"];
        setUser(null);
      } finally {
        setLoadingAuth(false);
      }
    })();
  }, []);


  const login = async ({ email, password }) => {
    const res = await API.post("/users/login", { email, password });
    const { accessToken, refreshToken, user: meUser } = res.data.data;
    setAccessToken(accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    API.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    setUser(meUser);
  };


  const register = async (formData) => {
    const res = await API.post("/users/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    const { accessToken, refreshToken, user: meUser } = res.data.data;
    setAccessToken(accessToken);
    localStorage.setItem("refreshToken", refreshToken);
    API.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
    setUser(meUser);
  };


  const logout = async () => {
    await API.post("/users/logout");
    localStorage.removeItem("refreshToken");
    delete API.defaults.headers.common["Authorization"];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user,accessToken, loadingAuth, login, register, logout, setUser, fetchUser}}
    >
      {children}
    </AuthContext.Provider>
  );
}
