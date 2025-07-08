import React from "react";
import { Box, Typography } from "@mui/material";
import { motion } from "framer-motion";

export default function LoadingPage() {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      sx={{
        height: "100vh",
        width: "100vw",
        bgcolor: "background.default",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
      }}
    >
      <motion.img
        src="/logo.svg"
        alt="Logo"
        initial={{ scale: 0.5 }}
        animate={{ scale: 1 }}
        transition={{
          yoyo: Infinity,
          duration: 0.8,
        }}
        style={{ width: 120, height: 120 }}
      />
      <Typography variant="h6" mt={2} color="text.secondary">
        Loading...
      </Typography>
    </Box>
  );
}
