import React from "react";
import { Box, Toolbar, Container } from "@mui/material";
import AppBar from "./AppBar.jsx";
import Drawer from "./Drawer.jsx";

export default function Layout({ children }) {
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar />
      <Drawer />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: "240px", // match drawer width
          mt: 8,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Container maxWidth="lg" sx={{ flexGrow: 1 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
