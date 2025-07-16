import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Navbar from "../components/Navbar.jsx";
import Footer from "../components/Footer.jsx";

import Home      from "../pages/Home.jsx";
import Login     from "../pages/Login.jsx";
import Register  from "../pages/Register.jsx";
import Dashboard from "../pages/Dashboard.jsx";
import Upload    from "../pages/Upload.jsx";
import VideoPlayer from "../pages/VideoPlayer.jsx";
import Profile     from "../pages/Profile.jsx";
import WatchPage from "../pages/WatchPage";
import OAuthHandler from "../auth/OAuthHandler.jsx";
import ProtectedRoute from "../auth/ProtectedRoute.jsx";
import MessagesPage from "../pages/Messages";
import ConversationsPage from "../pages/Conversations.jsx";
import ConversationListPage from "../pages/ConversationListPage.jsx";
import Search from "../pages/Search.jsx";


export default function Router() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/oauth/callback" element={<OAuthHandler />} />
        <Route path="/messages" element={<MessagesPage />} />
        <Route path="/search" element={<Search />} />
        
        <Route element={<ProtectedRoute />}>
          <Route path="/watch/:videoId" element={<WatchPage />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
          <Route path="/conversations" element={<ConversationListPage />} />
          <Route
            path="/conversations/:convId"
            element={<ConversationsPage />}
          />
          <Route path="/profile/:username" element={<Profile />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
      <Footer />
    </>
  );
}
