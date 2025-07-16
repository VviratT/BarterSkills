import React, { useContext } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Avatar,
  Box,
  MenuItem,
} from "@mui/material";
import { AuthContext } from "../context/AuthContext.jsx";
import { useNavigate, Link } from "react-router-dom";


export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Box sx={{ flexGrow: 1 }}>
          <Typography
            variant="h6"
            component={Link}
            to="/"
            color="inherit"
            sx={{ textDecoration: "none" }}
          >
            BarterSkills
          </Typography>
        </Box>

        {user ? (
          <>
            <Button color="inherit" component={Link} to="/messages">
              Global Chat
            </Button>
            <MenuItem color="inherit" component={Link} to="/conversations">
              Direct Messages
            </MenuItem>
            <Button color="inherit" component={Link} to="/">
              Home
            </Button>
            <Button color="inherit" component={Link} to="/dashboard">
              Dashboard
            </Button>
            <Button component={Link} to="/upload" color="inherit">
              Upload Video
            </Button>
            <Link
              to={`/profile/${user.username}`}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <Box display="flex" alignItems="center">
                <Avatar
                  src={user.avatar}
                  alt={user.fullName}
                  sx={{ ml: 2, mr: 1 }}
                />
                <Typography variant="body1">{user.fullName}</Typography>
              </Box>
            </Link>
            <Button color="inherit" onClick={handleLogout} sx={{ ml: 2 }}>
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
