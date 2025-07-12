import React, { useState } from "react";
import { Box, TextField, Button } from "@mui/material";

export default function CommentEditor({
  onSubmit,
  loading,
  initialValue = "",
}) {
  const [content, setContent] = useState(initialValue);
  return (
    <Box mb={2}>
      <TextField
        fullWidth
        multiline
        minRows={2}
        label="Write a comment…"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
      />
      <Button
        variant="contained"
        sx={{ mt: 1 }}
        disabled={loading}
        onClick={() => content.trim() && onSubmit(content)}
      >
        {initialValue ? "Update" : "Post"}
      </Button>
    </Box>
  );
}
