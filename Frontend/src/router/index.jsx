// src/router/index.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "../pages/Home.jsx";
import Login from "../pages/Login.jsx";
import Register from "../pages/Register.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Upload from "../pages/UploadVideo.jsx";
import VideoPlayer from "../pages/VideoPlayer.jsx";
import { useAuth } from "../hooks/useAuth.js"; // you’ll build this to read JWT

function Protected({ children }) {
  const { user } = useAuth();
  return user ? children : <Navigate to="/login" />;
}

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/video/:id" element={<VideoPlayer />} />
      <Route
        path="/upload"
        element={
          <Protected>
            <Upload />
          </Protected>
        }
      />
      <Route
        path="/dashboard"
        element={
          <Protected>
            <Dashboard />
          </Protected>
        }
      />
      {/* 404: */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
