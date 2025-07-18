// src/components/Navbar.jsx
import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
  IconButton,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { AuthContext } from "../context/AuthContext.jsx";
import { useThemeMode } from "../context/ThemeContext.jsx";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api.js";
import { useNavigate, Link } from "react-router-dom";

export default function Navbar() {
  const { user, setUser, logout } = useContext(AuthContext);
  const { mode, toggleMode } = useThemeMode();
  const qc = useQueryClient();
  const navigate = useNavigate();

  const premiumMut = useMutation(
    () => api.post("/users/premium", { days: 30 }),
    {
      onSuccess: ({ data }) => {
        // re‑fetch current user and update context
        api.get("/users/current-user").then((res) => {
          setUser(res.data.data);
          qc.invalidateQueries(["current-user"]);
        });
      },
      onError: (err) => alert(err.response?.data?.message || err.message),
    }
  );

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          color="inherit"
          sx={{ textDecoration: "none", flexGrow: 1 }}
        >
          BarterSkills
        </Typography>

        {/* Dark/Light toggle */}
        <IconButton color="inherit" onClick={toggleMode} sx={{ mr: 2 }}>
          {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
        </IconButton>

        {user && !user.isPremium && (
          <Button
            color="secondary"
            variant="contained"
            onClick={() => premiumMut.mutate()}
            disabled={premiumMut.isLoading}
            sx={{ mr: 2 }}
          >
            Go Premium
          </Button>
        )}

        {user ? (
          <>
            {/* ... your other nav items */}
            <Button color="inherit" onClick={logout}>
              Logout
            </Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">
              Login
            </Button>
            <Button color="inherit" component={Link} to="/register">
              Register
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}
