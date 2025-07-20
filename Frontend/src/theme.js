// src/theme.js
import { createTheme } from "@mui/material/styles";

const palette = {
  primary:   { main: "#5C6AC4" },
  secondary: { main: "#F3A712" },
  success:   { main: "#10B981" },
  info:      { main: "#3B82F6" },
  warning:   { main: "#F59E0B" },
  error:     { main: "#EF4444" },
  background:{
    default: "#F8FAFC",  // light neutral
    paper:   "#FFFFFF"   // card surfaces
  },
  text: {
    primary:   "#0F172A",
    secondary: "#475569"
  },
};

const typography = {
  fontFamily: `"Inter", "Source Sans Pro", sans-serif`,
  h1:  { fontSize: "2.25rem", fontWeight: 800 },
  h2:  { fontSize: "1.875rem", fontWeight: 700 },
  h3:  { fontSize: "1.5rem",  fontWeight: 600 },
  h4:  { fontSize: "1.25rem", fontWeight: 600 },
  body1:{ fontSize: "1rem",    fontWeight: 400 },
  body2:{ fontSize: "0.875rem",fontWeight: 400 },
  caption:{ fontSize: "0.75rem",fontWeight: 300 },
};

const theme = createTheme({
  palette,
  typography,
  spacing: 4,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: "16px",
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: palette.background.paper,
          color: palette.text.primary,
          boxShadow: "none",
          borderBottom: "1px solid #ddd",
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: "#F9FAFC",
          borderRight: "1px solid #ddd",
        },
      },
    },
  },
});

export default theme;
