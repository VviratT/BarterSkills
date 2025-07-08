import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

import Home      from "../pages/Home.jsx";
import Login     from "../pages/Login.jsx";
import Register  from "../pages/Register.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Upload    from "../pages/UploadVideo.jsx";
import VideoPlayer from "../pages/VideoPlayer.jsx";
import Profile     from "../pages/Profile.jsx";

import ProtectedRoute from "../auth/ProtectedRoute.jsx";

export default function Router() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload"    element={<Upload />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
          <Route path="/profile/:username" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </>
  );
}
