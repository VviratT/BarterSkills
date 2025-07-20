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
  Badge,
  Tooltip,
  Stack,
} from "@mui/material";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { motion } from "framer-motion";
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
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: "blur(10px)",
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        borderBottom: "1px solid rgba(229, 231, 235, 0.5)",
      }}
    >
      <Toolbar sx={{ minHeight: 70 }}>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h5"
            component={Link}
            to="/"
            color="primary"
            sx={{
              textDecoration: "none",
              flexGrow: 1,
              fontWeight: 700,
              letterSpacing: "-0.025em",
              "&:hover": {
                color: "primary.dark",
              },
            }}
          >
            BarterSkills
          </Typography>
        </motion.div>

        <Box sx={{ flexGrow: 1 }} />

        <Stack direction="row" spacing={1} alignItems="center">
          {/* Dark/Light toggle */}
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Tooltip
              title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
            >
              <IconButton
                color="inherit"
                onClick={toggleMode}
                sx={{
                  backgroundColor: "rgba(99, 102, 241, 0.1)",
                  "&:hover": {
                    backgroundColor: "rgba(99, 102, 241, 0.2)",
                  },
                }}
              >
                {mode === "light" ? <Brightness4Icon /> : <Brightness7Icon />}
              </IconButton>
            </Tooltip>
          </motion.div>

          {user && !user.isPremium && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant="contained"
                onClick={() => premiumMut.mutate()}
                disabled={premiumMut.isLoading}
                sx={{
                  background:
                    "linear-gradient(135deg, #F59E0B 0%, #FBBF24 100%)",
                  color: "white",
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  boxShadow: "0 4px 12px rgba(245, 158, 11, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(135deg, #D97706 0%, #F59E0B 100%)",
                    boxShadow: "0 6px 16px rgba(245, 158, 11, 0.4)",
                  },
                }}
              >
                {premiumMut.isLoading ? "Upgrading..." : "Go Premium"}
              </Button>
            </motion.div>
          )}

          {user ? (
            <Stack direction="row" spacing={2} alignItems="center">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  color="inherit"
                  component={Link}
                  to="/dashboard"
                  sx={{
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "rgba(99, 102, 241, 0.1)",
                    },
                  }}
                >
                  Dashboard
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  color="inherit"
                  component={Link}
                  to="/upload"
                  sx={{
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "rgba(99, 102, 241, 0.1)",
                    },
                  }}
                >
                  Upload
                </Button>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Tooltip title="Profile">
                  <IconButton
                    component={Link}
                    to={`/profile/${user.username}`}
                    sx={{ p: 0.5 }}
                  >
                    <Badge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      badgeContent={
                        <Box
                          sx={{
                            width: 12,
                            height: 12,
                            borderRadius: "50%",
                            backgroundColor: "#10B981",
                            border: "2px solid white",
                          }}
                        />
                      }
                    >
                      <Avatar
                        src={user.avatarUrl}
                        sx={{
                          width: 40,
                          height: 40,
                          border: "2px solid rgba(99, 102, 241, 0.2)",
                        }}
                      />
                    </Badge>
                  </IconButton>
                </Tooltip>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  color="inherit"
                  onClick={logout}
                  sx={{
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                      color: "error.main",
                    },
                  }}
                >
                  Logout
                </Button>
              </motion.div>
            </Stack>
          ) : (
            <Stack direction="row" spacing={2} alignItems="center">
              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  color="inherit"
                  component={Link}
                  to="/login"
                  sx={{
                    fontWeight: 500,
                    "&:hover": {
                      backgroundColor: "rgba(99, 102, 241, 0.1)",
                    },
                  }}
                >
                  Login
                </Button>
              </motion.div>

              <motion.div whileHover={{ scale: 1.05 }}>
                <Button
                  variant="outlined"
                  component={Link}
                  to="/register"
                  sx={{
                    fontWeight: 500,
                    borderWidth: "1.5px",
                    "&:hover": {
                      borderWidth: "1.5px",
                    },
                  }}
                >
                  Register
                </Button>
              </motion.div>
            </Stack>
          )}
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
