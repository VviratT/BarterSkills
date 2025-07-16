import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/api.js";
import {
  List,
  ListItemButton,
  ListItemText,
  Typography,
  Container,
} from "@mui/material";
import { Link } from "react-router-dom";

export default function ConversationListPage() {
  const { data: convos = [], isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => api.get("/messages/conversations").then((r) => r.data.data),
  });

  if (isLoading) return <Typography>Loading conversations…</Typography>;
  if (!convos.length)
    return <Typography>You have no conversations yet.</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Direct Messages
      </Typography>
      <List>
        {convos.map((c) => (
          <ListItemButton
            key={c._id}
            component={Link}
            to={`/conversations/${c._id}`}
          >
            <ListItemText
              primary={c.participants
                .filter((p) => !(p._id.includes(/* your own ID logic here */)))
                .map((p) => p.fullName)
                .join(", ")}
              secondary={c.lastMessage?.text || "No messages yet"}
            />
            {c.unreadCount > 0 && (
              <Typography variant="body2" color="primary">
                {c.unreadCount}
              </Typography>
            )}
          </ListItemButton>
        ))}
      </List>
    </Container>
  );
}
