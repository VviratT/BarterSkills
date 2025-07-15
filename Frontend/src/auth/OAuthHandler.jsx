// src/auth/OAuthHandler.jsx
import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/api.js"; // your axios instance
import useAuth from "./useAuth.js";

export default function OAuthHandler() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { setUser } = useAuth();

  useEffect(() => {
    const accessToken = searchParams.get("accessToken");
    const refreshToken = searchParams.get("refreshToken");

    if (accessToken && refreshToken) {
      // 1) persist the refreshToken
      localStorage.setItem("refreshToken", refreshToken);

      // 2) tell axios to send the accessToken on subsequent requests
      api.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;

      // 3) fetch the current user
      api
        .get("/users/current-user")
        .then(({ data }) => {
          setUser(data.data); // update React context
          navigate("/dashboard"); // or wherever
        })
        .catch((err) => {
          console.error("⚠️ failed to fetch current-user:", err);
          navigate("/login");
        });
    } else {
      // no tokens? go back to login
      navigate("/login");
    }
  }, []);

  return <div>Logging you in…</div>;
}
