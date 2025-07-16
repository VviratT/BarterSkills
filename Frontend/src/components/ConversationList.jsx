import React from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchConversations } from "../api/message.js";
import {
  List,
  ListItemButton,
  ListItemAvatar,
  Avatar,
  ListItemText,
  Badge,
  Typography,
} from "@mui/material";

export default function ConversationList({ onSelect }) {
  const { data: convos = [], isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: fetchConversations,
  });


  if (isLoading) return <Typography>Loading conversations…</Typography>;

  return (
    <List>
      {convos.map((c) => (
        <ListItemButton key={c._id} onClick={() => onSelect(c._id)}>
          <ListItemAvatar>
            <Badge badgeContent={c.unreadCount} color="primary">
              <Avatar
                src={
                  c.participants.find((p) => p._id !== c.currentUserId)?.avatar
                }
              />
            </Badge>
          </ListItemAvatar>
          <ListItemText
            primary={
              c.participants.find((p) => p._id !== c.currentUserId)?.fullName
            }
            secondary={c.lastMessage?.text || "No messages yet"}
          />
        </ListItemButton>
      ))}
    </List>
  );
}
