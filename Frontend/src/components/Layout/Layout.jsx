import React from "react";
import { Box, Toolbar, Container } from "@mui/material";
import AppBar from "./AppBar.jsx";
import Drawer from "./Drawer.jsx";
import Footer from "./Footer.jsx";

const drawerWidth = 240;

export default function Layout({ children }) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", flexDirection: "column" }}>
      {/* AppBar */}
      <AppBar drawerWidth={drawerWidth} />

      {/* Permanent Sidebar Drawer */}
      <Drawer drawerWidth={drawerWidth} />

      {/* Main content area */}
      <Box sx={{ display: "flex", flex: 1 }}>
        <Box
          component="main"
          sx={{
            flexGrow: 1,
            p: 3,
            ml: `${drawerWidth}px`,
            mt: 8,
            width: `calc(100% - ${drawerWidth}px)`,
          }}
        >
          <Container maxWidth="lg">{children}</Container>
        </Box>
      </Box>

      {/* Sticky Footer */}
      <Footer />
    </Box>
  );
}
