import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Chip,
  Grid,
  Skeleton,
  Divider,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Swiper from "swiper";
import "swiper/css";
import VideoCard from "../components/VideoCard";
import api from "../api/api.js";


const categories = ["All", "AI", "Coding", "Premium", "Education", "Recent"];

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
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Discover Videos
      </Typography>

      <Box mb={3} sx={{ overflowX: "auto", whiteSpace: "nowrap" }}>
        {categories.map((cat) => (
          <Chip
            key={cat}
            label={cat}
            onClick={() => setActiveCategory(cat)}
            color={cat === activeCategory ? "primary" : "default"}
            sx={{ mr: 1 }}
          />
        ))}
      </Box>

      <Divider sx={{ mb: 2 }} />

      {isLoading ? (
        <Grid container spacing={2}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Grid item xs={12} sm={6} md={4} key={i}>
              <Skeleton variant="rectangular" height={200} />
              <Skeleton width="60%" />
              <Skeleton width="80%" />
            </Grid>
          ))}
        </Grid>
      ) : isError ? (
        <Typography color="error">Error: {error.message}</Typography>
      ) : data.length === 0 ? (
        <Typography>No videos found.</Typography>
      ) : (
        <Grid container spacing={3}>
          {data.map((v) => (
            <Grid key={v._id} item xs={12} sm={6} md={4}>
              <VideoCard video={v} />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
