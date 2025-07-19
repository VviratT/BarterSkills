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

  const toggleDrawer = () => setOpen(!open);

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

  const drawer = (
    <Box sx={{ width: drawerWidth }}>
      <Toolbar
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6">BarterSkills</Typography>
        <IconButton onClick={toggleDrawer}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <Divider />

      <List>
        <ListItemButton component={RouterLink} to="/premium">
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary="Go Premium" />
        </ListItemButton>

        <ListItemButton component={RouterLink} to="/">
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/dashboard">
          <ListItemIcon>
            <DashboardIcon />
          </ListItemIcon>
          <ListItemText primary="Dashboard" />
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/upload">
          <ListItemIcon>
            <UploadIcon />
          </ListItemIcon>
          <ListItemText primary="Upload" />
        </ListItemButton>
        <Divider sx={{ my: 1 }} />
        <ListItemButton component={RouterLink} to="/messages">
          <ListItemIcon>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText primary="Global Chat" />
        </ListItemButton>
        <ListItemButton component={RouterLink} to="/conversations">
          <ListItemIcon>
            <MessageIcon />
          </ListItemIcon>
          <ListItemText primary="Direct Messages" />
        </ListItemButton>
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
    </Box>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: `calc(100% - ${open ? drawerWidth : 0}px)`,
          ml: `${open ? drawerWidth : 0}px`,
          transition: (theme) =>
            theme.transitions.create(["width", "margin"], {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            px: { xs: 1, sm: 2 },
          }}
        >
          {/* Left: Menu + Logo */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <IconButton color="inherit" edge="start" onClick={toggleDrawer}>
              <MenuIcon />
            </IconButton>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              color="inherit"
              sx={{ textDecoration: "none" }}
            >
              BarterSkills
            </Typography>
          </Box>

          {/* Center-Left: Search Bar */}
          <Box
            component="form"
            onSubmit={onSearchSubmit}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-start",
              bgcolor: "rgba(255,255,255,0.15)",
              borderRadius: 1,
              px: 1,
              flex: 1,
              maxWidth: 500,
              minWidth: 200,
              mx: { xs: 0, md: 4 },
            }}
          >
            <InputBase
              placeholder="Search…"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              sx={{ color: "inherit", flexGrow: 1 }}
            />
            <IconButton type="submit" color="inherit">
              <SearchIcon />
            </IconButton>
          </Box>

          {/* Right: Theme Toggle + Home + Profile */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <IconButton
              color="inherit"
              onClick={toggleMode}
              title="Toggle Theme"
            >
              {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
            </IconButton>

            <IconButton
              sx={{ mx: 5, p: 0 }}
              color="inherit"
              component={RouterLink}
              to="/"
              title="Home"
            >
              <HomeIcon />
            </IconButton>

            {user && (
              <>
                <IconButton sx={{ mx: 0, p: 0 }} onClick={handleAvatarClick}>
                  <Avatar src={user.avatar} />
                </IconButton>
                <Typography
                  variant="body2"
                  color="inherit"
                  sx={{ mr: 15, p: 0, fontWeight: 800 }}
                >
                  {user.username}
                </Typography>
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
                    <PersonIcon sx={{ mr: 1 }} /> My Profile
                  </MenuItem>
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon sx={{ mr: 1 }} /> Logout
                  </MenuItem>
                </Menu>
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
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawer}
      </Drawer>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          transition: (theme) =>
            theme.transitions.create("margin", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.leavingScreen,
            }),
          ml: `${open ? 0 : `-${drawerWidth}px`}`,
        }}
      >
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
