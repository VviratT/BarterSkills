import { createTheme } from "@mui/material/styles";

// your base color tokens
const tokens = {
  primary: {
    light: "#818CF8",
    main:  "#6366F1",
    dark:  "#4F46E5",
    contrastText: "#FFFFFF",
  },
  secondary: {
    light: "#FBBF24",
    main:  "#F59E0B",
    dark:  "#D97706",
    contrastText: "#FFFFFF",
  },
  success: {
    light: "#34D399",
    main:  "#10B981",
    dark:  "#059669",
  },
  info: {
    light: "#60A5FA",
    main:  "#3B82F6",
    dark:  "#2563EB",
  },
  warning: {
    light: "#FBBF24",
    main:  "#F59E0B",
    dark:  "#D97706",
  },
  error: {
    light: "#F87171",
    main:  "#EF4444",
    dark:  "#DC2626",
  },
};

// component style overrides (common)
const componentOverrides = {
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: 8,
        textTransform: "none",
        fontWeight: 500,
        padding: "8px 16px",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          transform: "translateY(-1px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        },
      },
      contained: {
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        "&:hover": {
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        },
      },
      outlined: {
        borderWidth: "1.5px",
      },
    },
  },
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: 16,
        boxShadow: "0 1px 3px rgba(0,0,0,0.1),0 1px 2px rgba(0,0,0,0.06)",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow:
            "0 4px 12px rgba(0,0,0,0.15),0 2px 4px rgba(0,0,0,0.1)",
          transform: "translateY(-2px)",
        },
      },
    },
  },
  MuiAppBar: {
    styleOverrides: {
      root: {
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        borderBottom: "1px solid",
      },
    },
  },
  MuiDrawer: {
    styleOverrides: {
      paper: {
        boxShadow: "2px 0 8px rgba(0,0,0,0.1)",
      },
    },
  },
  /* ...and your other overrides (TextField, Chip, IconButton, Accordion, Skeleton) */
};

/**
 * Returns a full MUI theme for the given mode ("light" or "dark").
 */
export function theme(mode = "light") {
  // build the palette for each mode
  const palette = {
    mode,
    ...(mode === "light"
      ? {
          background: { default: "#FAFAFA", paper: "#FFFFFF" },
          text:       { primary: "#1F2937", secondary: "#6B7280" },
          divider:    "#E5E7EB",
          ...tokens,
        }
      : {
          background: { default: "#121212", paper: "#1E1E1E" },
          text:       { primary: "#E5E7EB", secondary: "#9CA3AF" },
          divider:    "#373737",
          primary:    { ...tokens.primary, main: tokens.primary.light },
          secondary:  { ...tokens.secondary, main: tokens.secondary.light },
          success:    tokens.success,
          info:       tokens.info,
          warning:    tokens.warning,
          error:      tokens.error,
        }),
  };

  return createTheme({
    palette,
    typography: {
      fontFamily: `"Inter","Roboto","Helvetica","Arial",sans-serif`,
      h1: { fontSize: "2.5rem", fontWeight: 700 },
      h2: { fontSize: "2rem", fontWeight: 700 },
      h3: { fontSize: "1.5rem", fontWeight: 600 },
      body1: { fontSize: "1rem" },
      button: { fontSize: "0.875rem", textTransform: "none" },
    },
    shape: { borderRadius: 12 },
    spacing: 4,
    components: componentOverrides,
  });
}
