// src/components/ResponsiveDrawer.jsx
import React, { useContext, useState } from "react";
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
  Star as StarIcon,
} from "@mui/icons-material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import { useThemeMode } from "../context/ThemeContext.jsx";

const drawerWidth = 240;

export default function ResponsiveDrawer({ children }) {
  const navigate = useNavigate();
  const { user, logout } = useContext(AuthContext);
  const { mode, toggleMode } = useThemeMode();

  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);

  const toggleDrawer = () => setOpen((v) => !v);
  const onSearchSubmit = (e) => {
    e.preventDefault();
    const term = q.trim();
    if (term) {
      navigate(`/search?query=${encodeURIComponent(term)}`);
      setQ("");
    }
  };
  const handleAvatarClick = (e) => setAnchorEl(e.currentTarget);
  const handleAvatarClose = () => setAnchorEl(null);
  const handleLogout = async () => {
    await logout();
    handleAvatarClose();
    navigate("/login");
  };

  return (
    <Box sx={{ display: "flex" }}>
      {/* APP BAR */}
      <AppBar
        position="fixed"
        sx={{
          zIndex: (t) => t.zIndex.drawer + 1,
          transition: (t) =>
            t.transitions.create(["width", "margin"], {
              easing: t.transitions.easing.sharp,
              duration: t.transitions.duration.leavingScreen,
            }),
          width: `calc(100% - ${open ? drawerWidth : 0}px)`,
          ml: open ? `${drawerWidth}px` : 0,
          backgroundColor: "primary.main",
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: { xs: 1, sm: 2 },
          }}
        >
          {/* Left: Drawer Toggle + Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton color="inherit" onClick={toggleDrawer} edge="start">
              {open ? <ChevronLeftIcon /> : <MenuIcon />}
            </IconButton>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                color: "inherit",
                textDecoration: "none",
                fontWeight: 600,
              }}
            >
              BarterSkills
            </Typography>
          </Box>

          {/* Center: Search Bar */}
          <Box
            component="form"
            onSubmit={onSearchSubmit}
            sx={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "rgba(255,255,255,0.2)",
              borderRadius: 2,
              px: 1,
              mx: "auto",
              width: {
                xs: open ? "60%" : "50%",
                sm: open ? "45%" : "35%",
                md: open ? "40%" : "30%",
              },
              transition: (t) =>
                t.transitions.create("width", {
                  easing: t.transitions.easing.sharp,
                  duration: t.transitions.duration.shorter,
                }),
            }}
          >
            <InputBase
              placeholder="Search…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              sx={{ flex: 1, color: "inherit", pl: 1 }}
            />
            <IconButton type="submit" color="inherit" sx={{ p: 1 }}>
              <SearchIcon />
            </IconButton>
          </Box>

          {/* Right: Actions */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton color="inherit" onClick={toggleMode}>
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>
            <IconButton
              color="inherit"
              component={RouterLink}
              to="/"
              title="Home"
            >
              <HomeIcon />
            </IconButton>
            {user && (
              <>
                <Typography
                  variant="body2"
                  sx={{ color: "inherit", fontWeight: 500 }}
                >
                  {user.username}
                </Typography>
                <IconButton onClick={handleAvatarClick} sx={{ p: 0 }}>
                  <Avatar src={user.avatar} sx={{ width: 32, height: 32 }} />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleAvatarClose}
                >
                  <MenuItem
                    component={RouterLink}
                    to={`/profile/${user.username}`}
                    onClick={handleAvatarClose}
                  >
                    <PersonIcon sx={{ mr: 1 }} />
                    My Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} />
                    Logout
                  </MenuItem>
                </Menu>
              </>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* DRAWER */}
      <Drawer
        variant="persistent"
        open={open}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Divider />
        <List>
          {[
            ["/premium", <StarIcon />, "Go Premium"],
            ["/", <HomeIcon />, "Home"],
            ["/dashboard", <DashboardIcon />, "Dashboard"],
            ["/upload", <UploadIcon />, "Upload"],
            ["/messages", <ChatIcon />, "Global Chat"],
            ["/conversations", <MessageIcon />, "Direct Messages"],
          ].map(([to, Icon, text]) => (
            <ListItemButton key={text} component={RouterLink} to={to}>
              <ListItemIcon>{Icon}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          ))}
          <Divider sx={{ my: 1 }} />
          {user && (
            <>
              <ListItemButton
                component={RouterLink}
                to={`/profile/${user.username}`}
              >
                <ListItemIcon>
                  <Avatar src={user.avatar} sx={{ width: 24, height: 24 }} />
                </ListItemIcon>
                <ListItemText primary="My Profile" />
              </ListItemButton>
              <ListItemButton onClick={handleLogout}>
                <ListItemIcon>
                  <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItemButton>
            </>
          )}
        </List>
      </Drawer>

      {/* MAIN CONTENT */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 10, // push below AppBar
          transition: (t) =>
            t.transitions.create("margin", {
              easing: t.transitions.easing.sharp,
              duration: t.transitions.duration.leavingScreen,
            }),
          ml: open ? `${drawerWidth}px` : 0,
        }}
      >
        <Container maxWidth="lg">{children}</Container>
      </Box>
    </Box>
  );
}
