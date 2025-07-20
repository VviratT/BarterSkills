import React, { useState } from "react";
import {
  Button,
  Container,
  Typography,
  Card,
  CardContent,
  Alert,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import api from "../api/api.js";
import useAuth from "../auth/useAuth.js";

function loadRazorpayScript() {
  return new Promise((res, rej) => {
    if (window.Razorpay) return res();
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = res;
    s.onerror = rej;
    document.body.appendChild(s);
  });
}

export default function Premium() {
  const { user, setUser,refreshUser } = useAuth();
  const [plan, setPlan] = useState("monthly");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handlePlanChange = (_e, newPlan) => {
    if (newPlan) setPlan(newPlan);
  };

  const handlePurchase = async () => {
    setError("");
    setLoading(true);
    try {
      const { data } = await api.post("/billing/create-order", { plan });
      const { key, orderId, amount, currency } = data;

      await loadRazorpayScript();

      new window.Razorpay({
        key,
        amount, 
        currency,
        name: "BarterSkills Premium",
        description: plan === "monthly" ? "30‑Day Plan" : "1‑Year Plan",
        order_id: orderId,
        handler: async (resp) => {
          const { data: userData } = await api.post(
            "/billing/verify-payment",
            resp
          );
          setUser(userData);
          await refreshUser();
        },
        prefill: {
          name: user.fullName,
          email: user.email,
        },
      }).open();
    } catch (err) {
      console.error("Purchase error:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container sx={{ mt: 10, maxWidth: 600 }}>
      {user?.isPremium && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Premium active until{" "}
          {new Date(user.premiumExpiresAt).toLocaleDateString()}
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
            Choose Your Plan
          </Typography>

          <ToggleButtonGroup
            value={plan}
            exclusive
            onChange={handlePlanChange}
            sx={{ mb: 2 }}
          >
            <ToggleButton value="monthly">Monthly ₹50</ToggleButton>
            <ToggleButton value="yearly">Yearly ₹500</ToggleButton>
          </ToggleButtonGroup>

          <Button
            variant="contained"
            size="large"
            fullWidth
            disabled={loading || user?.isPremium}
            onClick={handlePurchase}
          >
            {user?.isPremium
              ? "You’re Premium"
              : loading
              ? "Processing…"
              : "Buy Now"}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
