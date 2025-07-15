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
} from "@mui/material";
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!avatarFile) return setError("Please upload an avatar");
    setError("");
    const data = new FormData();
    Object.entries(form).forEach(([k, v]) => data.append(k, v));
    data.append("avatar", avatarFile);
    try {
      await register(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box mt={10} p={4} boxShadow={3} bgcolor="background.paper">
        <Typography variant="h4" mb={2}>
          Register
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            name="fullName"
            label="Full Name"
            value={form.fullName}
            onChange={(e) =>
              setForm((f) => ({ ...f, fullName: e.target.value }))
            }
            margin="normal"
            required
          />
          <TextField
            fullWidth
            name="username"
            label="Username"
            value={form.username}
            onChange={(e) =>
              setForm((f) => ({ ...f, username: e.target.value }))
            }
            margin="normal"
            required
          />
          <TextField
            fullWidth
            name="email"
            label="Email"
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            margin="normal"
            required
          />
          <Button
            variant="contained"
            component="label"
            fullWidth
            sx={{ mt: 2 }}
          >
            Upload Avatar
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={(e) => setAvatarFile(e.target.files[0])}
            />
          </Button>
          {avatarFile && (
            <Typography variant="caption">{avatarFile.name}</Typography>
          )}
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Register
          </Button>
          <GoogleLoginButton />
        </form>
        <Box mt={2}>
          <Typography variant="body2">
            Already have an account? <Link to="/login">Log in</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
