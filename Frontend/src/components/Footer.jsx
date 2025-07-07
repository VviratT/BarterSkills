// src/components/Footer.jsx
import React from "react";
import { Box, Typography, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      py={3}
      textAlign="center"
      bgcolor="background.paper"
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} ChaiTube. All rights reserved.
        <Link href="https://github.com/your-repo" ml={1}>
          GitHub
        </Link>
      </Typography>
    </Box>
  );
}
