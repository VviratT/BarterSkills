import { Box, Button, TextField } from "@mui/material";
import { useState } from "react";

const CommentEditor = ({ onSubmit, loading, initialValue = "" }) => {
  const [content, setContent] = useState(initialValue);

  return (
    <Box sx={{ mb: 2 }}>
      <TextField
        fullWidth
        multiline
        minRows={2}
        maxRows={5}
        label="Write a comment..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={loading}
      />
      <Button
        variant="contained"
        onClick={() => {
          if (content.trim()) onSubmit(content);
        }}
        disabled={loading}
        sx={{ mt: 1 }}
      >
        {initialValue ? "Update" : "Post"}
      </Button>
    </Box>
  );
};

export default CommentEditor;
