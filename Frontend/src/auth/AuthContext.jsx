import React, { createContext, useState, useEffect } from "react";
import * as authApi from "../api/auth.js";

export const AuthContext = createContext({
  user: null,
  loadingAuth: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    authApi
      .fetchCurrent()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null))
      .finally(() => setLoadingAuth(false));
  }, []);

  const login = async (creds) => {
    await authApi.login(creds);
    const me = await authApi.fetchCurrent();
    setUser(me.data);
  };

  const register = async (creds) => {
    await authApi.register(creds);
    const me = await authApi.fetchCurrent();
    setUser(me.data);
  };

  const logout = async () => {
    await authApi.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, loadingAuth, login, logout, register }}
    >
      {children}
    </AuthContext.Provider>
  );
}
