import React from "react";
import {
  Drawer as MuiDrawer,
  Toolbar,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import { Link } from "react-router-dom";

const navItems = [
  { text: "Home", to: "/" },
  { text: "Upload", to: "/upload" },
  { text: "Dashboard", to: "/dashboard" },
  { text: "Chat", to: "/chat" },
  { text: "Payments", to: "/payments" },
];

export default function Drawer() {
  return (
    <MuiDrawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: "border-box" },
      }}
    >
      <Toolbar />
      <List>
        {navItems.map((item) => (
          <ListItem button key={item.to} component={Link} to={item.to}>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </MuiDrawer>
  );
}
