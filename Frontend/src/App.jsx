// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import ProtectedRoute from "./router/ProtectedRoute.jsx";

// Public pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

// Private pages
import Dashboard from "./pages/Dashboard.jsx";
import UploadVideo from "./pages/UploadVideo.jsx";
import VideoPlayer from "./pages/VideoPlayer.jsx";
import Profile from "./pages/Profile.jsx";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* public */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<UploadVideo />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
          <Route path="/profile/:username" element={<Profile />} />
        </Route>

        {/* catch all */}
        <Route path="*" element={<div>404 Not Found</div>} />
      </Routes>
    </>
  );
}
