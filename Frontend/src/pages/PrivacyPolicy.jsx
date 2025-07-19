import React from "react";
import { Container, Typography } from "@mui/material";
export default function PrivacyPolicy() {
  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Privacy Policy
      </Typography>
      <Typography paragraph>
        Your privacy is important to us. We collect only what’s needed to
        provide our service…
      </Typography>
      {/* …add more content here… */}
    </Container>
  );
}
