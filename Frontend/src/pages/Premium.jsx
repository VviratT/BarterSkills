// src/pages/Premium.jsx
import React from "react";
import { useState } from "react";
import {
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Alert,
} from "@mui/material";
import api from "../api/api.js";
import useAuth from "../auth/useAuth.js";

export default function Premium() {
  const { user, setUser } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGoPremium = async () => {
    setError("");
    setLoading(true);
    try {
      // 1) create order
      const { data: create } = await api.post("/billing/create-order");
      const { orderId, amount, keyId } = create.data;

      // 2) load Razorpay script
      await new Promise((res, rej) => {
        const s = document.createElement("script");
        s.src = "https://checkout.razorpay.com/v1/checkout.js";
        s.onload = res;
        s.onerror = rej;
        document.body.appendChild(s);
      });

      // 3) open checkout
      const options = {
        key: keyId,
        amount,
        currency: "INR",
        order_id: orderId,
        name: "BarterSkills Premium",
        handler: async (resp) => {
          // 4) verify on backend
          const { data: verify } = await api.post("/billing/verify", resp);
          setUser((u) => ({
            ...u,
            isPremium: verify.data.isPremium,
            premiumExpiresAt: verify.data.premiumExpiresAt,
          }));
        },
        theme: { color: "#1976d2" },
      };
      const rz = new window.Razorpay(options);
      rz.open();
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 4, maxWidth: 600 }}>
      {user?.isPremium && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Premium until {new Date(user.premiumExpiresAt).toLocaleDateString()}
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Card variant="outlined">
        <CardContent>
          <Typography variant="h5" gutterBottom>
            Go Premium
          </Typography>
          <Typography variant="body1" gutterBottom>
            ₹50 for 30 days of premium perks.
          </Typography>
          <Button
            variant="contained"
            size="large"
            fullWidth
            disabled={loading || user?.isPremium}
            onClick={handleGoPremium}
          >
            {user?.isPremium
              ? "Already Premium"
              : loading
              ? "Processing…"
              : "Pay ₹299"}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
