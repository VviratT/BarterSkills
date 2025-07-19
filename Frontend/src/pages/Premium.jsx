// src/pages/Premium.jsx
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
  const { user, setUser, refreshUser } = useAuth();
  const [plan, setPlan] = useState("monthly");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // 🔧 Fix: define this handler
  const handlePlanChange = (_event, newPlan) => {
    if (newPlan) setPlan(newPlan);
  };

  const handleSubscribe = async () => {
    setError("");
    setLoading(true);
    try {
      // 1) Kick off subscription on the backend
      const resp = await api.post("/billing/subscribe", { plan });
      console.log("subscribe resp:", resp.data);
      const { key, subscriptionId } = resp.data; // <– subscriptionId here

      // 2) Load Razorpay script
      await loadRazorpayScript();

      // 3) Open checkout
      new window.Razorpay({
        key,
        subscription_id: subscriptionId,
        name: "BarterSkills Premium",
        description:
          plan === "monthly" ? "Monthly Plan (₹50)" : "Yearly Plan (₹500)",
        handler: async () => {
          console.log(
            "✅ Razorpay payment successful – verifying subscription…"
          );

          const now = new Date();
          const expiresAt = new Date(
            now.setDate(now.getDate() + (plan === "monthly" ? 30 : 365))
          );
          setUser((u) => ({
            ...u,
            isPremium: true,
            premiumExpiresAt: expiresAt.toISOString(),
          }));
   
          console.log(
            `🟢 Marked premium locally until ${expiresAt.toLocaleDateString()}`
          );
        },
        prefill: {
          name: user.fullName,
          email: user.email,
        },
      }).open();
    } catch (err) {
      console.error("Subscribe error:", err);
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Container sx={{ mt: 4, maxWidth: 600 }}>
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
            onChange={handlePlanChange} // now defined
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
            onClick={handleSubscribe}
          >
            {user?.isPremium
              ? "You’re Premium"
              : loading
              ? "Processing…"
              : "Subscribe Now"}
          </Button>
        </CardContent>
      </Card>
    </Container>
  );
}
