import React from "react";
import { Box, Toolbar } from "@mui/material";
import AppBar from "./AppBar.jsx";
import Drawer from "./Drawer.jsx";

export default function Layout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar />
      <Drawer />
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
}
