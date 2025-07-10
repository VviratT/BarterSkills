// src/auth/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import api from "../api/axios.js";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/users/current-user");
        setUser(data.data);
      } catch (err) {
        // if 401 (or any) → treat as not logged in, silently
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const login = async (creds) => {
    await api.post("/users/login", creds);
    // after login, fetch the user
    const { data } = await api.get("/users/current-user");
    setUser(data.data);
  };

  const logout = async () => {
    await api.post("/users/logout");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
}
