import React from "react";
import {
  AppBar as MuiAppBar,
  Toolbar,
  Typography,
  Button,
} from "@mui/material";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth.js";

export default function AppBar() {
  const { user, logout } = useAuth();

  return (
    <MuiAppBar position="fixed">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, color: "inherit", textDecoration: "none" }}
        >
          VideoAI Pro
        </Typography>

        {user ? (
          <>
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
    </MuiAppBar>
  );
}
