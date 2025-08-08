import React from "react";
import { Button } from "@mui/material";

export default function GoogleLoginButton() {
  const handleGoogle = () => {
    // note the full /api/v1/users prefix
    window.location.href = `${import.meta.env.VITE_API_URL}/users/auth/google`;
  };

  return (
    <Button variant="outlined" fullWidth sx={{ mt: 2 }} onClick={handleGoogle}>
      Continue with Google
    </Button>
  );
}

