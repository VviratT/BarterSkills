import React from "react";
import {
  Container,
  Typography,
  Grid,
  CardMedia,
  Card,
  CardContent,
  Box,
  Stack,
  Chip,
  Avatar,
  LinearProgress,
  IconButton,
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import api from "../api/api.js";
import useAuth from "../auth/useAuth.js";
import { Link } from "react-router-dom";
import {
  TrendingUp,
  Visibility,
  People,
  VideoLibrary,
  PlayArrow,
  CalendarToday,
  ThumbUp,
  Money,
  Diamond,
} from "@mui/icons-material";

const statCards = [
  {
    icon: VideoLibrary,
    label: "Total Videos",
    color: "#6366F1",
    bgColor: "rgba(99, 102, 241, 0.1)",
  },
  {
    icon: Visibility,
    label: "Total Views",
    color: "#10B981",
    bgColor: "rgba(16, 185, 129, 0.1)",
  },
  {
    icon: People,
    label: "Subscribers",
    color: "#F59E0B",
    bgColor: "rgba(245, 158, 11, 0.1)",
  },
  {
    icon: Diamond,
    label: "User Credits",
    color: "#1604D1",
    bgColor: "rgba(34, 11, 245, 0.1)",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
    },
  },
};

export default function Dashboard() {
  const { user } = useAuth();
  const channelId = user?._id;

  const { data: stats = {}, isLoading: statsLoading } = useQuery({
    queryKey: ["dashboardStats", channelId],
    queryFn: () => api.get(`/dashboard/stats`).then((r) => r.data.data ?? {}),
    enabled: !!channelId,
  });

  const { data: recent = [], isLoading: videosLoading } = useQuery({
    queryKey: ["dashboardVideos", channelId],
    queryFn: () => api.get(`/dashboard/videos`).then((r) => r.data.data ?? []),
    enabled: !!channelId,
  });

  if (statsLoading || videosLoading) {
    return (
      <Box sx={{ width: "100%", minHeight: "100vh" }}>
        <Container maxWidth="xl" sx={{ mt: 4, px: { xs: 2, sm: 3, md: 4 } }}>
          <Box sx={{ width: "100%" }}>
            <LinearProgress />
          </Box>
          <Typography sx={{ mt: 2 }}>Loading dashboard...</Typography>
        </Container>
      </Box>
    );
  }

  return (
    <Box sx={{ width: "100%", minHeight: "100vh" }}>
      <Container
        maxWidth="xl"
        sx={{ mt: 10, mb: 6, px: { xs: 2, sm: 3, md: 4 } }}
      >
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <motion.div variants={itemVariants}>
            <Box mb={4} textAlign="center">
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 1,
                  background:
                    "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                  backgroundClip: "text",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Creator Dashboard
              </Typography>
              <Typography variant="h6" color="text.secondary">
                Welcome back, {user?.fullName}! Here's how your channel is
                performing.
              </Typography>
            </Box>
          </motion.div>

          {/* Stats Cards */}
          <motion.div variants={itemVariants}>
            <Grid container spacing={3} mb={6} justifyContent="center">
              {[
                {
                  label: "Total Videos",
                  value: stats.totalVideos ?? 0,
                  ...statCards[0],
                },
                {
                  label: "Total Views",
                  value: stats.totalViews ?? 0,
                  ...statCards[1],
                },
                {
                  label: "Subscribers",
                  value: stats.subscribersCount ?? 0,
                  ...statCards[2],
                },
                {
                  label: "User Credits",
                  value: user.credits ?? 0,
                  ...statCards[3],
                },
              ].map((stat, index) => (
                <Grid item xs={12} sm={6} md={4} key={stat.label}>
                  <motion.div
                    whileHover={{ y: -8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card
                      sx={(theme) => ({
                        p: 3,
                        borderRadius: 3,
                        background:
                          theme.palette.mode === "light"
                            ? "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95))"
                            : "linear-gradient(135deg, rgba(30, 30, 30, 0.7), rgba(45, 45, 45, 0.8))",
                        backdropFilter: "blur(10px)",
                        border: `1px solid ${
                          theme.palette.mode === "light"
                            ? "rgba(255, 255, 255, 0.2)"
                            : "rgba(255, 255, 255, 0.1)"
                        }`,
                        boxShadow:
                          theme.palette.mode === "light"
                            ? "0 8px 32px rgba(0, 0, 0, 0.1)"
                            : "0 8px 32px rgba(0, 0, 0, 0.4)",
                      })}
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Box
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            backgroundColor: stat.bgColor,
                            color: stat.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        >
                          <stat.icon sx={{ fontSize: 28 }} />
                        </Box>
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography
                            variant="h4"
                            fontWeight={700}
                            color="text.primary"
                          >
                            {stat.value.toLocaleString()}
                          </Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            fontWeight={500}
                          >
                            {stat.label}
                          </Typography>
                        </Box>
                      </Stack>
                    </Card>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </motion.div>

          {/* Recent Videos Section */}
          <motion.div variants={itemVariants}>
            <Box mb={4} textAlign="center">
              <Typography variant="h4" fontWeight={600} mb={3}>
                Your Recent Videos
              </Typography>
            </Box>
          </motion.div>

          {recent.length === 0 ? (
            <motion.div variants={itemVariants}>
              <Box display="flex" justifyContent="center">
                <Card
                  sx={(theme) => ({
                    p: 6,
                    textAlign: "center",
                    borderRadius: 3,
                    background:
                      theme.palette.mode === "light"
                        ? "linear-gradient(135deg, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.95))"
                        : "linear-gradient(135deg, rgba(38, 38, 38, 0.7), rgba(25, 25, 25, 0.8))",
                    backdropFilter: "blur(10px)",
                    border: `1px solid ${
                      theme.palette.mode === "light"
                        ? "rgba(255, 255, 255, 0.2)"
                        : "rgba(255, 255, 255, 0.1)"
                    }`,
                    maxWidth: 500,
                  })}
                >
                  <VideoLibrary
                    sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                  />
                  <Typography variant="h6" color="text.secondary" mb={1}>
                    No videos yet
                  </Typography>
                  <Typography variant="body1" color="text.secondary" mb={3}>
                    Start creating amazing content by uploading your first
                    video!
                  </Typography>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link to="/upload" style={{ textDecoration: "none" }}>
                      <Chip
                        label="Upload Video"
                        color="primary"
                        sx={{
                          px: 3,
                          py: 1,
                          fontSize: "1rem",
                          fontWeight: 600,
                        }}
                      />
                    </Link>
                  </motion.div>
                </Card>
              </Box>
            </motion.div>
          ) : (
            <motion.div variants={itemVariants}>
              <Grid container spacing={3} justifyContent="center">
                {recent.map((video, index) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={video._id}>
                    <motion.div
                      whileHover={{ y: -8 }}
                      transition={{ duration: 0.2 }}
                      style={{ height: "100%" }}
                    >
                      <Card
                        component={Link}
                        to={`/watch/${video._id}`}
                        sx={{
                          height: "100%",
                          textDecoration: "none",
                          color: "inherit",
                          borderRadius: 3,
                          overflow: "hidden",
                          background:
                            "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                          transition: "all 0.3s ease-in-out",
                          "&:hover": {
                            boxShadow: "0 8px 24px rgba(0, 0, 0, 0.15)",
                            transform: "translateY(-4px)",
                          },
                        }}
                      >
                        <Box sx={{ position: "relative" }}>
                          <CardMedia
                            component="img"
                            height="200"
                            image={video.thumbnail}
                            alt={video.title}
                            sx={{ objectFit: "cover" }}
                          />

                          {/* Play Button Overlay */}
                          <Box
                            sx={{
                              position: "absolute",
                              top: 0,
                              left: 0,
                              right: 0,
                              bottom: 0,
                              backgroundColor: "rgba(0, 0, 0, 0.3)",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              opacity: 0,
                              transition: "opacity 0.3s ease-in-out",
                              "&:hover": {
                                opacity: 1,
                              },
                            }}
                          >
                            <IconButton
                              sx={{
                                backgroundColor: "rgba(255, 255, 255, 0.9)",
                                color: "primary.main",
                                width: 50,
                                height: 50,
                                "&:hover": {
                                  backgroundColor: "white",
                                  transform: "scale(1.1)",
                                },
                              }}
                            >
                              <PlayArrow sx={{ fontSize: 24 }} />
                            </IconButton>
                          </Box>

                          {/* Premium Badge */}
                          {video.isPremium && (
                            <Chip
                              label="Premium"
                              size="small"
                              sx={{
                                position: "absolute",
                                top: 12,
                                right: 12,
                                backgroundColor: "rgba(245, 158, 11, 0.9)",
                                color: "white",
                                fontWeight: 600,
                              }}
                            />
                          )}
                        </Box>

                        <CardContent sx={{ p: 3 }}>
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              mb: 1,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              lineHeight: 1.3,
                            }}
                          >
                            {video.title}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              mb: 2,
                              display: "-webkit-box",
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                            }}
                          >
                            {video.description}
                          </Typography>

                          <Stack
                            direction="row"
                            spacing={2}
                            alignItems="center"
                            mb={2}
                          >
                            <Box display="flex" alignItems="center">
                              <Visibility
                                sx={{
                                  fontSize: 16,
                                  mr: 0.5,
                                  color: "text.secondary",
                                }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {video.views || 0}
                              </Typography>
                            </Box>

                            <Box display="flex" alignItems="center">
                              <ThumbUp
                                sx={{
                                  fontSize: 16,
                                  mr: 0.5,
                                  color: "text.secondary",
                                }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {video.likeCount || 0}
                              </Typography>
                            </Box>
                          </Stack>

                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Box display="flex" alignItems="center">
                              <CalendarToday
                                sx={{
                                  fontSize: 14,
                                  mr: 0.5,
                                  color: "text.secondary",
                                }}
                              />
                              <Typography
                                variant="caption"
                                color="text.secondary"
                              >
                                {new Date(video.createdAt).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </Box>
  );
}
