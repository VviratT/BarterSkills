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
import api from "../api/axios.js"; 
import { AuthContext } from "../auth/AuthContext.jsx";

export default function Login() {
  const navigate = useNavigate();
  const { setUser } = useContext(AuthContext); 
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");


  const mutation = useMutation(() => api.post("/users/login", form), {
    onSuccess: (res) => {
      const { accessToken, user } = res.data;
      localStorage.setItem("accessToken", accessToken); 
      setUser(user); 
      navigate("/dashboard");
    },
    onError: (err) => {
      setError(err.response?.data?.message || "Login failed");
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
          Log In
        </Typography>
        {error && <Alert severity="error">{error}</Alert>}
        <form onSubmit={handleSubmit}>
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
            {mutation.isLoading ? "Logging in…" : "Log In"}
          </Button>
        </form>
        <Box mt={2}>
          <Typography variant="body2">
            Don’t have an account? <Link to="/register">Register</Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  );
}
