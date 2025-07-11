import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import useAuth from "./useAuth";

export default function OAuthHandler() {
  const navigate = useNavigate();
  const { setUser } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const { data } = await api.get("/users/auth/google/callback");
        localStorage.setItem("accessToken", data.accessToken);
        setUser(data.user);
        navigate("/");
      } catch {
        navigate("/login");
      }
    })();
  }, []);

  return <div>Logging you in…</div>;
}
