import React from "react";
import { Box, Typography, Link } from "@mui/material";

export default function Footer() {
  return (
    <Box
      component="footer"
      py={3}
      textAlign="center"
      bgcolor="background.paper"
    >
      <Typography variant="body2" color="text.secondary">
        © {new Date().getFullYear()} BarterSkills. All rights reserved.
        <Link href="https://github.com/your-repo" ml={1}>
          GitHub
        </Link>
      </Typography>
      {[
        ["Privacy Policy", "/privacy-policy"],
        ["Terms & Conditions", "/terms-and-conditions"],
        ["Cancellation & Refund", "/cancellation-refund"],
        ["Shipping & Delivery", "/shipping-delivery"],
        ["Contact Us", "/contact-us"],
      ].map(([label, to]) => (
        <Link key={to} href={to} sx={{ mx: 1 }}>
          {label}
        </Link>
      ))}
    </Box>
  );
}
