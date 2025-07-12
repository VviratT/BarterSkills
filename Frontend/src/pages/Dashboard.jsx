import React from "react";
import {
  Container,
  Typography,
  Grid,
  CardMedia ,
  Card,
  CardContent,
  Box,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import api from "../api/api.js";
import { motion } from "framer-motion";
import useAuth from "../auth/useAuth.js";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { user } = useAuth();
  const channelId = user?._id;

  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboardStats", channelId],
    queryFn: () =>
      api.get(`/dashboard/stats`).then((r) => r.data.data ?? {}),
    enabled: !!channelId,
  });

  const { data: recent = [], isLoading: videosLoading } = useQuery({
    queryKey: ["dashboardVideos", channelId],
    queryFn: () =>
      api.get(`/dashboard/videos`).then((r) => r.data.data ?? []),
    enabled: !!channelId,
  });

  if (statsLoading || videosLoading)
    return <Typography>Loading dashboard…</Typography>;

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>
        Creator Dashboard
      </Typography>
      <Grid container spacing={3} mb={4}>
        {[
          { label: "Total Videos", value: stats.totalVideos ?? 0 },
          { label: "Total Views", value: stats.totalViews ?? 0 },
          { label: "Subscribers", value: stats.subscribersCount ?? 0 },
        ].map((stat) => (
          <Grid item xs={12} sm={4} key={stat.label}>
            <motion.div whileHover={{ scale: 1.03 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6">{stat.label}</Typography>
                  <Typography variant="h3">{stat.value}</Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      <Typography variant="h5" mb={2}>
        Your Recent Videos
      </Typography>
      <Grid container spacing={3}>
        {recent.map((v) => (
          <Grid item xs={12} sm={6} md={4} key={v._id}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1">{v.title}</Typography>
                  <Typography variant="body2" noWrap>
                    {v.description}
                  </Typography>
                  <Box mt={1}>
                    <Typography variant="caption">{v.views} views</Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>
      {recent.map((video) => (
        <Link
          key={video._id}
          to={`/watch/${video._id}`}
          style={{ textDecoration: "none", color: "inherit" }}
        >
          <Card>
            <CardMedia
              component="img"
              height="180"
              image={video.thumbnail}
              alt={video.title}
            />
            <CardContent>
              <Typography variant="h6" noWrap>
                {video.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {video.owner.fullName}
              </Typography>
            </CardContent>
          </Card>
        </Link>
      ))}
    </Container>
  );
}
