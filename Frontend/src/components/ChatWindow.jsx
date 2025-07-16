import React, { useEffect, useState, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { fetchConversation, postMessage } from "../api/message.js";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

export default function ChatWindow({ convId }) {
  const qc = useQueryClient();
  const [text, setText] = useState("");
  const { data: messages = [], isLoading } = useQuery({
    queryKey: ["conversation", convId],
    queryFn: () => fetchConversation(convId),
    enabled: !!convId,
  });


  const sendMut = useMutation({
    mutationFn: (t) => postMessage(convId, t),
    onSuccess: () => {
      qc.invalidateQueries(["conversation", convId]);
      setText("");
    },
  });

  if (!convId) return <Typography>Select a conversation</Typography>;
  if (isLoading) return <Typography>Loading chat…</Typography>;

  return (
    <Paper
      sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}
    >
      <Box sx={{ flex: 1, overflowY: "auto", mb: 2 }}>
        <List>
          {messages.map((m, i) => (
            <ListItem key={i} alignItems="flex-start">
              <ListItemText
                primary={<strong>{m.sender.fullName}</strong>}
                secondary={m.text}
              />
            </ListItem>
          ))}
        </List>
      </Box>
      <Box
        component="form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!text.trim()) return;
          sendMut.mutate(text);
        }}
        sx={{ display: "flex", gap: 1 }}
      >
        <TextField
          fullWidth
          variant="outlined"
          size="small"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <Button type="submit" variant="contained" disabled={sendMut.isLoading}>
          Send
        </Button>
      </Box>
    </Paper>
  );
}
