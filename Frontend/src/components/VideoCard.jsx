import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function VideoCard({ video }) {
  const nav = useNavigate();
  return (
    <Card onClick={() => nav(`/watch/${video._id}`)} sx={{ cursor: "pointer" }}>
      <CardMedia component="img" height="140" image={video.thumbnail} />
      <CardContent>
        <Typography variant="subtitle1" noWrap>
          {video.title}
        </Typography>
        <Box display="flex" alignItems="center" mt={1}>
          <Avatar
            src={video.owner.avatarUrl}
            sx={{ width: 24, height: 24, mr: 1 }}
          />
          <Typography variant="body2" color="text.secondary">
            {video.owner.fullName}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
