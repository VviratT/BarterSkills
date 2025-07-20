import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext.jsx";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
  Paper,
  Divider,
  Stack,
  IconButton,
  InputAdornment,
  Fade,
  Avatar,
  Chip,
} from "@mui/material";
import { motion } from "framer-motion";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
  Badge,
  CloudUpload,
  CheckCircle,
} from "@mui/icons-material";
import GoogleLoginButton from "../components/GoogleLoginButton.jsx";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useContext(AuthContext);
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    password: "",
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!avatarFile) return setError("Please upload an avatar");
    setError("");
    setIsLoading(true);

    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    data.append("avatar", avatarFile);

    try {
      await register(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordToggle = () => {
    setShowPassword(!showPassword);
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          style={{ width: "100%" }}
        >
          <Paper
            elevation={0}
            sx={{
              p: { xs: 3, sm: 4 },
              borderRadius: 3,
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
            }}
          >
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 1,
                    background:
                      "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                    backgroundClip: "text",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  Join BarterSkills
                </Typography>
              </motion.div>
              <Typography variant="body1" color="text.secondary">
                Create your account and start sharing your knowledge
              </Typography>
            </Box>

            {/* Error Alert */}
            <Fade in={!!error}>
              <Box mb={3}>
                <Alert
                  severity="error"
                  sx={{
                    borderRadius: 2,
                    border: "1px solid rgba(239, 68, 68, 0.2)",
                  }}
                >
                  {error}
                </Alert>
              </Box>
            </Fade>

            {/* Registration Form */}
            <motion.form
              onSubmit={handleSubmit}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Stack spacing={3}>
                <TextField
                  fullWidth
                  name="fullName"
                  label="Full Name"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, fullName: e.target.value }))
                  }
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Person color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "primary.main",
                        },
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  name="username"
                  label="Username"
                  value={form.username}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, username: e.target.value }))
                  }
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Badge color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "primary.main",
                        },
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  name="email"
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, email: e.target.value }))
                  }
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email color="action" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "primary.main",
                        },
                      },
                    },
                  }}
                />

                <TextField
                  fullWidth
                  name="password"
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, password: e.target.value }))
                  }
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock color="action" />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          onClick={handlePasswordToggle}
                          edge="end"
                          size="small"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover": {
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "primary.main",
                        },
                      },
                    },
                  }}
                />

                {/* Avatar Upload */}
                <Box>
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button
                      variant="outlined"
                      component="label"
                      fullWidth
                      startIcon={<CloudUpload />}
                      sx={{
                        py: 2,
                        borderRadius: 2,
                        borderWidth: "1.5px",
                        borderStyle: "dashed",
                        borderColor: avatarFile ? "success.main" : "divider",
                        backgroundColor: avatarFile
                          ? "rgba(16, 185, 129, 0.1)"
                          : "transparent",
                        "&:hover": {
                          borderColor: avatarFile
                            ? "success.main"
                            : "primary.main",
                          backgroundColor: avatarFile
                            ? "rgba(16, 185, 129, 0.1)"
                            : "rgba(99, 102, 241, 0.1)",
                        },
                      }}
                    >
                      {avatarFile ? "Avatar Selected" : "Upload Avatar"}
                      <input
                        type="file"
                        accept="image/*"
                        hidden
                        onChange={handleAvatarChange}
                      />
                    </Button>
                  </motion.div>

                  {avatarFile && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        mt={1}
                      >
                        <CheckCircle color="success" sx={{ fontSize: 20 }} />
                        <Typography
                          variant="body2"
                          color="success.main"
                          fontWeight={500}
                        >
                          {avatarFile.name}
                        </Typography>
                      </Stack>
                    </motion.div>
                  )}
                </Box>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    disabled={isLoading || !avatarFile}
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: "1rem",
                      fontWeight: 600,
                      background:
                        "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                      boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)",
                      "&:hover": {
                        background:
                          "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                        boxShadow: "0 6px 16px rgba(99, 102, 241, 0.4)",
                      },
                      "&:disabled": {
                        background: "rgba(0, 0, 0, 0.12)",
                        color: "rgba(0, 0, 0, 0.38)",
                      },
                    }}
                  >
                    {isLoading ? "Creating Account..." : "Create Account"}
                  </Button>
                </motion.div>
              </Stack>
            </motion.form>

            {/* Divider */}
            <Box sx={{ my: 3, display: "flex", alignItems: "center" }}>
              <Divider sx={{ flexGrow: 1 }} />
              <Typography variant="body2" color="text.secondary" sx={{ px: 2 }}>
                or
              </Typography>
              <Divider sx={{ flexGrow: 1 }} />
            </Box>

            {/* Google Login */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <GoogleLoginButton />
            </motion.div>

            {/* Login Link */}
            <Box textAlign="center" mt={3}>
              <Typography variant="body2" color="text.secondary">
                Already have an account?{" "}
                <Link
                  to="/login"
                  style={{
                    color: "#6366F1",
                    textDecoration: "none",
                    fontWeight: 600,
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Sign in here
                </Link>
              </Typography>
            </Box>
          </Paper>
        </motion.div>
      </Box>
    </Container>
  );
}
