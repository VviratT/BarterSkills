import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // to prevent flicker

  const fetchUser = async () => {
    try {
      const res = await api.get("/users/current-user"); // uses accessToken
      setUser(res.data.user);
    } catch (err) {
      console.log("Not logged in");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (formData) => {
    const res = await api.post("/users/login", formData);
    localStorage.setItem("accessToken", res.data.accessToken);
    setUser(res.data.user);
  };

  const logout = async () => {
    await api.post("/users/logout");
    localStorage.removeItem("accessToken");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
