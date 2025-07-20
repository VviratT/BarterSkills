import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Grid,
  Skeleton,
  Divider,
  Stack,
  Alert,
  Fade,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swiper from "swiper";
import "swiper/css";
import VideoCard from "../components/VideoCard";
import api from "../api/api.js";

const categories = [
  { id: "All", label: "All", icon: "🎬" },
  { id: "AI", label: "AI", icon: "🤖" },
  { id: "Coding", label: "Coding", icon: "💻" },
  { id: "Premium", label: "Premium", icon: "⭐" },
  { id: "Education", label: "Education", icon: "📚" },
  { id: "Recent", label: "Recent", icon: "🕒" },
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
      duration: 0.3,
    },
  },
};

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("All");

  const {
    data = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["videos", activeCategory],
    queryFn: async () => {
      const params = {};
      if (activeCategory === "Recent") {
        params.sortBy = "createdAt";
        params.sortType = "desc";
      } else if (activeCategory === "Premium") {
        params.query = "Premium";
      } else if (activeCategory !== "All") {
        params.query = activeCategory;
      }

      console.log(" Fetching videos with params:", params);

      const res = await api.get("/videos", { params });

      console.log(" Fetched videos:", res.data);

      return res.data?.data ?? [];
    },
  });

  return (
    <Box
      sx={{ width: "100%", minHeight: "100vh", bgcolor: "background.default" }}
    >
      <Container
        maxWidth="xl"
        sx={{
          mt: 6,
          mb: 0,
          px: { xs: 2, sm: 3, md: 4 },
          pt: { xs: 2, sm: 4 },
        }}
      >
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <Box textAlign="center" mb={6}>
            <Typography
              variant="h2"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                backgroundClip: "text",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Discover Amazing Videos
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 600, mx: "auto" }}
            >
              Explore a world of knowledge, creativity, and innovation through
              our curated collection of videos
            </Typography>
          </Box>
        </motion.div>

        {/* Categories */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Box mb={4}>
            <Typography variant="h5" fontWeight={600} mb={3} textAlign="center">
              Browse by Category
            </Typography>
            <Box
              sx={{
                display: "flex",
                gap: { xs: 0.5, sm: 1 },
                flexWrap: "wrap",
                justifyContent: "center",
                alignItems: "center",
                maxWidth: "800px",
                mx: "auto",
              }}
            >
              {categories.map((cat) => (
                <motion.div
                  key={cat.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Chip
                    label={`${cat.icon} ${cat.label}`}
                    onClick={() => setActiveCategory(cat.id)}
                    color={cat.id === activeCategory ? "primary" : "default"}
                    variant={cat.id === activeCategory ? "filled" : "outlined"}
                    sx={{
                      fontSize: "0.9rem",
                      fontWeight: 500,
                      px: 2,
                      py: 1,
                      cursor: "pointer",
                      transition: "all 0.2s ease-in-out",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
                      },
                    }}
                  />
                </motion.div>
              ))}
            </Box>
          </Box>
        </motion.div>

        <Divider sx={{ mb: 5 }} />

        {/* Content Section */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {isLoading ? (
              <Grid
                container
                spacing={3}
                justifyContent="center"
                alignItems="stretch"
              >
                {Array.from({ length: 8 }).map((_, i) => (
                  <Grid
                    item
                    xs={12}
                    sm={6}
                    md={4}
                    lg={3}
                    key={i}
                    sx={{
                      display: "flex",
                      minHeight: 400,
                    }}
                  >
                    <motion.div
                      variants={itemVariants}
                      initial="hidden"
                      animate="visible"
                      transition={{ delay: i * 0.1 }}
                      style={{
                        height: "100%",
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                      }}
                    >
                      <Skeleton
                        variant="rectangular"
                        height={200}
                        sx={{ borderRadius: 2, mb: 2 }}
                      />
                      <Skeleton width="90%" height={24} sx={{ mb: 1 }} />
                      <Skeleton width="70%" height={20} sx={{ mb: 1 }} />
                      <Skeleton width="60%" height={16} />
                    </motion.div>
                  </Grid>
                ))}
              </Grid>
            ) : isError ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <Box display="flex" justifyContent="center">
                  <Alert
                    severity="error"
                    sx={{
                      maxWidth: 600,
                      borderRadius: 2,
                    }}
                  >
                    <Typography variant="h6" mb={1}>
                      Oops! Something went wrong
                    </Typography>
                    <Typography variant="body2">
                      {error.message ||
                        "Failed to load videos. Please try again later."}
                    </Typography>
                  </Alert>
                </Box>
              </motion.div>
            ) : data.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Box textAlign="center" py={8}>
                  <Typography variant="h5" color="text.secondary" mb={2}>
                    No videos found
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {activeCategory === "All"
                      ? "Be the first to upload a video!"
                      : `No videos found in the "${activeCategory}" category.`}
                  </Typography>
                </Box>
              </motion.div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <Grid
                  container
                  spacing={3}
                  justifyContent="center"
                  alignItems="stretch"
                  pb={4}
                >
                  {data.map((v, index) => (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={4}
                      lg={3}
                      key={v._id}
                      sx={{
                        display: "flex",
                        minHeight: 400,
                      }}
                    >
                      <motion.div
                        variants={itemVariants}
                        style={{
                          height: "100%",
                          width: "100%",
                          display: "flex",
                        }}
                      >
                        <VideoCard video={v} />
                      </motion.div>
                    </Grid>
                  ))}
                </Grid>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>
      </Container>
    </Box>
  );
}
