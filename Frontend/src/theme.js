// src/theme.js
import { createTheme } from "@mui/material/styles";

const palette = {
  primary: {
    main: "#6366F1", // Modern indigo
    light: "#818CF8",
    dark: "#4F46E5",
    contrastText: "#FFFFFF"
  },
  secondary: {
    main: "#F59E0B", // Warm amber
    light: "#FBBF24",
    dark: "#D97706",
    contrastText: "#FFFFFF"
  },
  success: {
    main: "#10B981", // Emerald green
    light: "#34D399",
    dark: "#059669"
  },
  info: {
    main: "#3B82F6", // Blue
    light: "#60A5FA",
    dark: "#2563EB"
  },
  warning: {
    main: "#F59E0B", // Amber
    light: "#FBBF24",
    dark: "#D97706"
  },
  error: {
    main: "#EF4444", // Red
    light: "#F87171",
    dark: "#DC2626"
  },
  background: {
    default: "#FAFAFA", // Very light gray
    paper: "#FFFFFF"
  },
  text: {
    primary: "#1F2937", // Dark gray
    secondary: "#6B7280" // Medium gray
  },
  divider: "#E5E7EB"
};

const typography = {
  fontFamily: `"Inter", "Roboto", "Helvetica", "Arial", sans-serif`,
  h1: {
    fontSize: "2.5rem",
    fontWeight: 700,
    lineHeight: 1.2,
    letterSpacing: "-0.025em"
  },
  h2: {
    fontSize: "2rem",
    fontWeight: 700,
    lineHeight: 1.3,
    letterSpacing: "-0.025em"
  },
  h3: {
    fontSize: "1.5rem",
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: "-0.025em"
  },
  h4: {
    fontSize: "1.25rem",
    fontWeight: 600,
    lineHeight: 1.4
  },
  h5: {
    fontSize: "1.125rem",
    fontWeight: 600,
    lineHeight: 1.4
  },
  h6: {
    fontSize: "1rem",
    fontWeight: 600,
    lineHeight: 1.4
  },
  body1: {
    fontSize: "1rem",
    fontWeight: 400,
    lineHeight: 1.6
  },
  body2: {
    fontSize: "0.875rem",
    fontWeight: 400,
    lineHeight: 1.5
  },
  caption: {
    fontSize: "0.75rem",
    fontWeight: 400,
    lineHeight: 1.4
  },
  button: {
    fontSize: "0.875rem",
    fontWeight: 500,
    textTransform: "none",
    letterSpacing: "0.025em"
  }
};

const shape = {
  borderRadius: 12
};

const theme = createTheme({
  palette,
  typography,
  shape,
  spacing: 4,
  components: {
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
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
          }
        },
        contained: {
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)"
          }
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": {
            borderWidth: "1.5px"
          }
        }
      }
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.06)",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15), 0 2px 4px rgba(0, 0, 0, 0.1)",
            transform: "translateY(-2px)"
          }
        }
      }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: palette.background.paper,
          color: palette.text.primary,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          borderBottom: "1px solid #E5E7EB"
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          backgroundColor: palette.background.paper,
          borderRight: "1px solid #E5E7EB",
          boxShadow: "2px 0 8px rgba(0, 0, 0, 0.1)"
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: palette.primary.main
              }
            },
            "&.Mui-focused": {
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: palette.primary.main,
                borderWidth: "2px"
              }
            }
          }
        }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          fontWeight: 500,
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.05)"
          }
        }
      }
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            transform: "scale(1.1)"
          }
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          boxShadow: "0 1px 3px rgba(0, 0, 0, 0.1)",
          "&:before": {
            display: "none"
          }
        }
      }
    },
    MuiSkeleton: {
      styleOverrides: {
        root: {
          borderRadius: 8
        }
      }
    }
  }
});

export default theme;