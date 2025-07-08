import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "./AuthContext.jsx";

export default function ProtectedRoute() {
  const { user, loadingAuth } = useContext(AuthContext);
  if (loadingAuth) return null; // or <LoadingPage />

  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
