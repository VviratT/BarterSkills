// src/pages/Register.jsx
import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  TextField,
  Button,
  Typography,
  Container,
  Alert,
} from "@mui/material";
import { useMutation } from "@tanstack/react-query";
import api from "../api/axios";
import { AuthContext } from "../auth/AuthContext.jsx";

export default function Register() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");

  const mutation = useMutation(() => api.post("/users/register", form), {
    onSuccess: (res) => {
      const { accessToken, user } = res.data;
      localStorage.setItem("accessToken", accessToken); // ✅ store token
      setUser(user); // ✅ store user info
      navigate("/dashboard");
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Registration failed");
    },
  });

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    mutation.mutate();
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
            name="name"
            label="Full Name"
            value={form.name}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            name="email"
            label="Email"
            value={form.email}
            onChange={handleChange}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            name="password"
            label="Password"
            type="password"
            value={form.password}
            onChange={handleChange}
            margin="normal"
            required
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2 }}
            disabled={mutation.isLoading}
          >
            {mutation.isLoading ? "Registering…" : "Register"}
          </Button>
        </form>
        <Box mt={2}>
          <Typography variant="body2">
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
