import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";

export default function ProtectedRoute() {
  const { user, loadingAuth } = useContext(AuthContext);
  if (loadingAuth) return <div>Loading…</div>;
  return user ? <Outlet /> : <Navigate to="/login" replace />;
}
