import React from "react";
import {
  Drawer as MuiDrawer,
  Toolbar,
  List,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";

export default function Drawer({ drawerWidth }) {
  const location = useLocation();
  const navItems = [
    { text: "Home", to: "/" },
    { text: "Upload", to: "/upload" },
    { text: "Dashboard", to: "/dashboard" },
    { text: "Chat", to: "/chat" },
    { text: "Payments", to: "/payments" },
  ];

  return (
    <MuiDrawer
      variant="permanent"
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
      <List>
        {navItems.map((item) => (
          <ListItemButton
            key={item.to}
            component={Link}
            to={item.to}
            selected={location.pathname === item.to}
          >
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </MuiDrawer>
  );
}
