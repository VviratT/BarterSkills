// src/components/layout/Footer.jsx
import React from "react";
import { Box, Typography, Link, Divider, Stack } from "@mui/material";

const footerLinks = [
  { label: "Privacy Policy", to: "/privacy-policy" },
  { label: "Terms & Conditions", to: "/terms-and-conditions" },
  { label: "Cancellation & Refund", to: "/cancellation-refund" },
  { label: "Shipping & Delivery", to: "/shipping-delivery" },
  { label: "Contact Us", to: "/contact-us" },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "background.paper",
        borderTop: 1,
        borderColor: "divider",
        mt: 4,
        py: 3,
      }}
    >
      <Divider />
      <Stack
        direction="row"
        justifyContent="center"
        alignItems="center"
        spacing={2}
        flexWrap="wrap"
        sx={{ mt: 2 }}
      >
        {footerLinks.map(({ label, to }) => (
          <Link key={to} href={to} variant="body2" color="text.secondary">
            {label}
          </Link>
        ))}
        <Link
          href="https://github.com/your-repo"
          variant="body2"
          color="text.secondary"
        >
          GitHub
        </Link>
      </Stack>
      <Typography
        variant="body2"
        color="text.secondary"
        align="center"
        sx={{ mt: 1 }}
      >
        © {new Date().getFullYear()} BarterSkills. All rights reserved.
      </Typography>
    </Box>
  );
}
