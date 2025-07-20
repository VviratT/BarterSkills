// src/components/ResponsiveDrawer.jsx
import React, { useContext, useState } from "react";
import { useTheme } from "@mui/material/styles";
import {
  Box,
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  InputBase,
  Avatar,
  Menu,
  MenuItem,
  Container,
  Chip,
  Badge,
  Tooltip,
  Fade,
  Button,
  alpha,
} from "@mui/material";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Home as HomeIcon,
  Dashboard as DashboardIcon,
  CloudUpload as UploadIcon,
  Chat as ChatIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  Logout as LogoutIcon,
  Search as SearchIcon,
  Brightness4 as DarkModeIcon,
  Brightness7 as LightModeIcon,
  Settings as SettingsIcon,
  VideoLibrary as VideoLibraryIcon,
  Login as LoginIcon,
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext.jsx";
import { useThemeMode } from "../context/ThemeContext.jsx";

const drawerWidth = 280;

export default function ResponsiveDrawer({ children }) {
  const theme = useTheme();  
  const isDark = theme.palette.mode === "dark";
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const { mode, toggleMode } = useThemeMode();

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleDrawer = () => setOpen((prev) => !prev);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      navigate(`/search?query=${encodeURIComponent(query)}`);
      setSearchQuery("");
    }
  };

  const handleAvatarClick = (e) => setAnchorEl(e.currentTarget);
  const handleAvatarClose = () => setAnchorEl(null);

  const handleLogout = async () => {
    await logout();
    handleAvatarClose();
    navigate("/login");
  };

  const isActive = (path) => location.pathname === path;

  const menuItems = [
    { path: "/", icon: <HomeIcon />, text: "Home" },
    { path: "/dashboard", icon: <DashboardIcon />, text: "Dashboard" },
    { path: "/upload", icon: <UploadIcon />, text: "Upload Video" },
    { path: "/videos", icon: <VideoLibraryIcon />, text: "My Videos" },
    { path: "/messages", icon: <ChatIcon />, text: "Global Chat" },
    { path: "/conversations", icon: <MessageIcon />, text: "Direct Messages" },
  ];

  return (
    <>
      {/* App Bar */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: (theme) =>
            theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          width: `calc(100% - ${open ? drawerWidth : 0}px)`,
          ml: open ? `${drawerWidth}px` : 0,
          backgroundColor: mode === "light" ? "#FFFFFF" : "#20043d",
          borderBottom: `1px solid ${theme.palette.divider}`,
          backdropFilter: isDark ? "none" : "blur(10px)",
          color: "text.primary",
          pt: 0.5,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 2,
            minHeight: 70,
          }}
        >
          {/* Left Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <IconButton
                onClick={toggleDrawer}
                edge="start"
                sx={{
                  backgroundColor: "rgba(99, 102, 241, 0.1)",
                  color: "text.primary",
                  "&:hover": {
                    backgroundColor: "rgba(99, 102, 241, 0.2)",
                  },
                }}
              >
                {open ? <ChevronLeftIcon /> : <MenuIcon />}
              </IconButton>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Typography
                variant="h5"
                component={RouterLink}
                to="/"
                sx={{
                  color: "inherit",
                  textDecoration: "none",
                  fontWeight: 700,
                  background:
                    "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                BarterSkills
              </Typography>
            </motion.div>
          </Box>

          {/* Center Section - Search */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ flex: 1, maxWidth: 600, margin: "0 20px" }}
          >
            <Box
              component="form"
              onSubmit={handleSearchSubmit}
              sx={(theme) => ({
                display: "flex",
                alignItems: "center",

                // theme‑aware background:
                backgroundColor:
                  theme.palette.mode === "light"
                    ? alpha(theme.palette.common.white, 0.8)
                    : alpha(theme.palette.background.paper, 0.16),

                borderRadius: 3,
                px: 2,
                py: 1,

                // use theme divider color
                border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,

                // use the theme's elevation‐1 shadow
                boxShadow: theme.shadows[1],

                "&:hover": {
                  boxShadow: theme.shadows[4],
                },
              })}
            >
              <InputBase
                placeholder="Search videos, creators..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{
                  flex: 1,
                  color: "text.primary",
                  "& .MuiInputBase-input::placeholder": {
                    color: "text.secondary",
                    opacity: 0.7,
                  },
                }}
              />
              <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                <IconButton
                  type="submit"
                  sx={(theme) => ({
                    color: "text.primary",
                    backgroundColor:
                      theme.palette.mode === "light"
                        ? alpha(theme.palette.primary.main, 0.1)
                        : alpha(theme.palette.primary.main, 0.2),
                    "&:hover": {
                      backgroundColor:
                        theme.palette.mode === "light"
                          ? alpha(theme.palette.primary.main, 0.2)
                          : alpha(theme.palette.primary.main, 0.3),
                    },
                  })}
                >
                  <SearchIcon />
                </IconButton>
              </motion.div>
            </Box>
          </motion.div>

          {/* Right Section */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Theme Toggle */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Tooltip
                title={`Switch to ${mode === "light" ? "dark" : "light"} mode`}
              >
                <IconButton
                  onClick={toggleMode}
                  sx={{
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                    color: "text.primary",
                    "&:hover": {
                      backgroundColor: "rgba(99, 102, 241, 0.2)",
                    },
                  }}
                >
                  {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
                </IconButton>
              </Tooltip>
            </motion.div>

            {/* Home Icon */}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Tooltip title="Home">
                <IconButton
                  component={RouterLink}
                  to="/"
                  sx={{
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                    color: "text.primary",
                    "&:hover": {
                      backgroundColor: "rgba(99, 102, 241, 0.2)",
                    },
                  }}
                >
                  <HomeIcon />
                </IconButton>
              </Tooltip>
            </motion.div>

            {/* User Section */}
            {user ? (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Tooltip title="Premium">
                    <Chip
                      label="Premium"
                      size="small"
                      sx={{
                        backgroundColor: "rgba(245, 158, 11, 0.9)",
                        color: "white",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                      onClick={() => navigate("/premium")}
                    />
                  </Tooltip>
                </motion.div>

                <Typography
                  variant="body2"
                  sx={{
                    color: "text.primary",
                    fontWeight: 600,
                    mx: 1,
                  }}
                >
                  {user.username}
                </Typography>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Tooltip title="Profile menu">
                    <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
                      <Avatar
                        src={user.avatar}
                        sx={{
                          width: 40,
                          height: 40,
                          border: "2px solid rgba(99, 102, 241, 0.2)",
                          cursor: "pointer",
                        }}
                      />
                    </IconButton>
                  </Tooltip>
                </motion.div>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleAvatarClose}
                  TransitionComponent={Fade}
                  PaperProps={{
                    elevation: 8,
                    sx: (theme) => ({
                      borderRadius: 2,
                      mt: 1,
                      minWidth: 200,
                      // theme‑aware background:
                      background:
                        theme.palette.mode === "light"
                          ? "linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.95) 100%)"
                          : theme.palette.background.paper,
                      backdropFilter:
                        theme.palette.mode === "light" ? "blur(10px)" : "none",
                      border:
                        theme.palette.mode === "light"
                          ? "1px solid rgba(255,255,255,0.2)"
                          : `1px solid ${theme.palette.divider}`,
                    }),
                  }}
                >
                  <MenuItem
                    component={RouterLink}
                    to={`/profile/${user.username}`}
                    onClick={handleAvatarClose}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                      "&:hover": {
                        backgroundColor: "rgba(99, 102, 241, 0.1)",
                      },
                    }}
                  >
                    <PersonIcon sx={{ mr: 2, color: "text.primary" }} />
                    My Profile
                  </MenuItem>
                  <MenuItem
                    component={RouterLink}
                    to="/settings"
                    onClick={handleAvatarClose}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                      "&:hover": {
                        backgroundColor: "rgba(99, 102, 241, 0.1)",
                      },
                    }}
                  >
                    <SettingsIcon sx={{ mr: 2, color: "text.primary" }} />
                    Settings
                  </MenuItem>
                  <Divider sx={{ my: 1 }} />
                  <MenuItem
                    onClick={handleLogout}
                    sx={{
                      borderRadius: 1,
                      mx: 1,
                      my: 0.5,
                      color: "error.main",
                      "&:hover": {
                        backgroundColor: "rgba(244, 67, 54, 0.1)",
                      },
                    }}
                  >
                    <LogoutIcon sx={{ mr: 2 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    component={RouterLink}
                    to="/login"
                    variant="outlined"
                    startIcon={<LoginIcon />}
                    sx={{
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      fontWeight: 600,
                      bordercolor: "text.primary",
                      color: "text.primary",
                      "&:hover": {
                        backgroundColor: "rgba(99, 102, 241, 0.1)",
                        borderColor: "primary.dark",
                      },
                    }}
                  >
                    Login
                  </Button>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Button
                    component={RouterLink}
                    to="/register"
                    variant="contained"
                    sx={{
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      fontWeight: 600,
                      background:
                        "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                      },
                    }}
                  >
                    Register
                  </Button>
                </motion.div>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Drawer */}
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: theme.palette.background.paper,
            borderRight: `1px solid ${theme.palette.divider}`,
          },
        }}
      >
        <Toolbar sx={{ minHeight: 70 }} />
        <Box sx={{ p: 2 }}>
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Navigation
            </Typography>
          </motion.div>
        </Box>
        <Divider sx={{ mx: 2 }} />
        <List sx={{ px: 2, py: 1 }}>
          {menuItems.map((item, index) => (
            <motion.div
              key={item.text}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <ListItemButton
                component={RouterLink}
                to={item.path}
                selected={isActive(item.path)}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  backgroundColor: isActive(item.path)
                    ? "rgba(99, 102, 241, 0.1)"
                    : "transparent",
                  color: isActive(item.path) ? "primary.main" : "text.primary",
                  "&:hover": {
                    backgroundColor: isActive(item.path)
                      ? "rgba(99, 102, 241, 0.15)"
                      : "rgba(99, 102, 241, 0.05)",
                  },
                  "&.Mui-selected": {
                    backgroundColor: "rgba(99, 102, 241, 0.1)",
                    "&:hover": {
                      backgroundColor: "rgba(99, 102, 241, 0.15)",
                    },
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    color: isActive(item.path)
                      ? "primary.main"
                      : "text.secondary",
                    minWidth: 40,
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  sx={{
                    fontWeight: isActive(item.path) ? 600 : 500,
                  }}
                />
              </ListItemButton>
            </motion.div>
          ))}

          <Divider sx={{ my: 2 }} />

          {user ? (
            <>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <ListItemButton
                  component={RouterLink}
                  to={`/profile/${user.username}`}
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    "&:hover": {
                      backgroundColor: "rgba(99, 102, 241, 0.05)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <Avatar
                      src={user.avatar}
                      sx={{
                        width: 28,
                        height: 28,
                        border: "2px solid rgba(99, 102, 241, 0.2)",
                      }}
                    />
                  </ListItemIcon>
                  <ListItemText
                    primary="My Profile"
                    secondary={user.username}
                    primaryTypographyProps={{ fontWeight: 600 }}
                    secondaryTypographyProps={{ fontSize: "0.8rem" }}
                  />
                </ListItemButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <ListItemButton
                  onClick={handleLogout}
                  sx={{
                    borderRadius: 2,
                    color: "error.main",
                    "&:hover": {
                      backgroundColor: "rgba(244, 67, 54, 0.1)",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: "error.main",
                      minWidth: 40,
                    }}
                  >
                    <LogoutIcon />
                  </ListItemIcon>
                  <ListItemText primary="Logout" />
                </ListItemButton>
              </motion.div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 }}
              >
                <ListItemButton
                  component={RouterLink}
                  to="/login"
                  sx={{
                    borderRadius: 2,
                    mb: 1,
                    "&:hover": {
                      backgroundColor: "rgba(99, 102, 241, 0.05)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <LoginIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Login"
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItemButton>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.7 }}
              >
                <ListItemButton
                  component={RouterLink}
                  to="/register"
                  sx={{
                    borderRadius: 2,
                    "&:hover": {
                      backgroundColor: "rgba(99, 102, 241, 0.05)",
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    <PersonIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Register"
                    primaryTypographyProps={{ fontWeight: 600 }}
                  />
                </ListItemButton>
              </motion.div>
            </>
          )}
        </List>
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={(theme) => ({
          flexGrow: 1,
          pt: 10,
          ml: open ? `${drawerWidth}px` : 0,
          minHeight: "100vh",

          transition: theme.transitions.create(["margin"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),

          background:
            theme.palette.mode === "light"
              ? "linear-gradient(135deg, rgba(248,250,252,0.8) 0%, rgba(241,245,249,0.8) 100%)"
              : theme.palette.background.default,
        })}
      >
        <Container maxWidth="xl" sx={{ py: 0 }}>
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {children}
            </motion.div>
          </AnimatePresence>
        </Container>
      </Box>
    </>
  );
}
