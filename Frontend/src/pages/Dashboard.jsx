// src/pages/Dashboard.jsx
import React from "react";
import { Container, Typography, Grid, Card, CardContent, Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "../api/axios.js";
import { motion } from "framer-motion";

export default function Dashboard() {
  const channelId = /* get from user context, e.g. useAuth().user._id */;

  const { data: stats, isLoading: statsLoading } = useQuery(
    ["dashboardStats", channelId],
    () => axios.get(`/api/v1/dashboard/stats/${channelId}`).then((r) => r.data.data)
  );

  const { data: recent, isLoading: videosLoading } = useQuery(
    ["dashboardVideos", channelId],
    () => axios.get(`/api/v1/dashboard/videos/${channelId}`).then((r) => r.data.data)
  );

  if (statsLoading || videosLoading) {
    return <Typography>Loading dashboard…</Typography>;
  }

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" mb={3}>Creator Dashboard</Typography>
      <Grid container spacing={3} mb={4}>
        {[
          { label: "Total Videos", value: stats.totalVideos },
          { label: "Total Views", value: stats.totalViews },
          { label: "Subscribers", value: stats.subscribersCount },
        ].map((stat) => (
          <Grid item xs={12} sm={4} key={stat.label}>
            <motion.div whileHover={{ scale: 1.03 }}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{stat.label}</Typography>
                  <Typography variant="h3">{stat.value}</Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" mb={2}>Your Recent Videos</Typography>
      <Grid container spacing={3}>
        {recent.map((v) => (
          <Grid item xs={12} sm={6} md={4} key={v._id}>
            <motion.div whileHover={{ scale: 1.02 }}>
              <Card>
                <CardContent>
                  <Typography variant="subtitle1">{v.title}</Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
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
    </Container>
  );
}
