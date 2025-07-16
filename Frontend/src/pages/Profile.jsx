// src/pages/Profile.jsx
import React from "react";
import { useParams } from "react-router-dom";
import {
  Container,
  Box,
  Avatar,
  Typography,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api.js";
import { toggleSubscribe } from "../api/subscription.js"; 
import { Link } from "react-router-dom";

export default function Profile() {
  const { username } = useParams();
  const qc = useQueryClient();

  // 1) Fetch channel profile
  const { data: channel, isLoading: loadingChannel } = useQuery({
    queryKey: ["channel", username],
    queryFn: () => api.get(`/users/c/${username}`).then((res) => res.data.data),
  });

  // 2) Fetch that user's videos
  const { data: videos = [], isLoading: loadingVideos } = useQuery({
    queryKey: ["channelVideos", channel?._id],
    enabled: !!channel?._id,
    queryFn: () =>
      api
        .get("/videos", { params: { userId: channel._id } })
        .then((res) => res.data.data),
  });

  // 3) Subscribe toggle mutation
  const subMut = useMutation({
    mutationFn: () => toggleSubscribe(channel._id),
    onSuccess: () => {
      qc.invalidateQueries(["channel", username]);
    },
  });

  if (loadingChannel) return <Typography>Loading profile…</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      {/* Cover + Avatar */}
      <Box
        sx={{
          height: 200,
          backgroundImage: `url(${channel.coverImage || "/default-cover.jpg"})`,
          backgroundSize: "cover",
          borderRadius: 1,
        }}
      />
      <Avatar
        src={channel.avatar}
        sx={{
          width: 100,
          height: 100,
          mt: -6,
          border: "3px solid white",
        }}
      />

      {/* Name / Stats / Subscribe */}
      <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 2 }}>
        <Box>
          <Typography variant="h5">{channel.fullName}</Typography>
          <Typography color="textSecondary">@{channel.username}</Typography>
          <Typography variant="body2" sx={{ mt: 1 }}>
            {channel.subscribersCount} subscriber
            {channel.subscribersCount !== 1 && "s"}
          </Typography>
        </Box>
        <Button
          variant={channel.isSubscribed ? "outlined" : "contained"}
          onClick={() => subMut.mutate()}
          disabled={subMut.isLoading}
        >
          {channel.isSubscribed ? "Unsubscribe" : "Subscribe"}
        </Button>
      </Box>

      {/* Videos grid */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Videos by {channel.fullName}
        </Typography>

        {loadingVideos ? (
          <Typography>Loading videos…</Typography>
        ) : (
          <Grid container spacing={2}>
            {videos.map((v) => (
              <Grid key={v._id} item xs={12} sm={6} md={4}>
                <Link to={`/watch/${v._id}`} style={{ textDecoration: "none" }}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={v.thumbnail}
                      alt={v.title}
                    />
                    <CardContent>
                      <Typography variant="subtitle1" noWrap>
                        {v.title}
                      </Typography>
                      <Typography variant="body2" color="textSecondary" noWrap>
                        {v.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Link>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}
