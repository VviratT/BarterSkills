import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api.js";
import {
  Container,
  Typography,
  Box,
  TextField,
  Button,
  Stack,
    Avatar,
    Paper,
} from "@mui/material";

export default function ConversationPage() {
  const { convId } = useParams();
  const qc = useQueryClient();
  const [text, setText] = useState("");

  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["conversation", convId],
    queryFn: () => api.get(`/messages/${convId}`).then((r) => r.data.data),
  });

  const postMut = useMutation({
    mutationFn: () => api.post(`/messages/${convId}`, { text }),
    onSuccess: (res) => {
      qc.invalidateQueries(["conversation", convId]);
      setText("");
    },
  });

  if (isLoading) return <Typography>Loading chat…</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Conversation
      </Typography>
      <Box sx={{ mb: 2, maxHeight: 400, overflowY: "auto", pr: 1 }}>
        {messages.map((m, i) => (
          <Stack
            key={i}
            direction="row"
            alignItems="flex-start"
            spacing={1}
            sx={{ mb: 1 }}
          >
            <Avatar
              src={m.sender.avatar}
              alt={m.sender.fullName}
              sx={{ width: 32, height: 32 }}
            />
            <Paper
              elevation={1}
              sx={{
                p: 1.2,
                backgroundColor: "#f5f5f5",
                borderRadius: 2,
                maxWidth: "75%",
              }}
            >
              <Typography variant="subtitle2" color="primary">
                {m.sender.fullName}
              </Typography>
              <Typography variant="body2" sx={{ wordWrap: "break-word" }}>
                {m.text}
              </Typography>
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 0.5 }}
              >
                {new Date(m.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </Typography>
            </Paper>
          </Stack>
        ))}
      </Box>
      <Stack direction="row" spacing={2}>
        <TextField
          fullWidth
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type a message…"
        />
        <Button
          variant="contained"
          onClick={() => postMut.mutate()}
          disabled={postMut.isLoading || !text.trim()}
        >
          Send
        </Button>
      </Stack>
    </Container>
  );
}
