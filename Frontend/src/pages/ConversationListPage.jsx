import React from "react";
import { useQuery } from "@tanstack/react-query";
import api from "../api/api.js";
import {
  List,
  ListItemButton,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Container,
} from "@mui/material";
import { Link } from "react-router-dom";
import useAuth from "../auth/useAuth.js";

export default function ConversationListPage() {
  const user = useAuth();
  const userId = user?.id;

  const { data: convos = [], isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: () => api.get("/messages/conversations").then((r) => r.data.data),
  });

  if (isLoading) return <Typography>Loading conversations…</Typography>;
  if (!convos.length)
    return <Typography>You have no conversations yet.</Typography>;

  return (
    <Container sx={{ mt: 10 }}>
      <Typography variant="h4" gutterBottom>
        Direct Messages
      </Typography>
      <List>
        {convos.map((c) => {
          const others = c.participants.filter((p) => p._id !== userId);
          const firstOther = others[0]; 
          return (
            <ListItemButton
              key={c._id}
              component={Link}
              to={`/conversations/${c._id}`}
            >
              <ListItemAvatar>
                <Avatar
                  src={firstOther?.avatarUrl || ""}
                  alt={firstOther?.fullName}
                >
                  {firstOther?.fullName?.[0] || "?"}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={others.map((p) => p.fullName).join(", ")}
                secondary={c.lastMessage?.text || "No messages yet"}
              />
              {c.unreadCount > 0 && (
                <Typography variant="body2" color="primary">
                  {c.unreadCount}
                </Typography>
              )}
            </ListItemButton>
          );
        })}
      </List>
    </Container>
  );
}
