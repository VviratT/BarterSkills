import React from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  Container,
  TextField,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Box,
  Button,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import api from "../api/api.js";

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get("query") || "";

  const {
    data: videos = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["searchVideos", query],
    queryFn: () =>
      api
        .get("/videos", { params: { query, limit: 20 } })
        .then((res) => res.data.data),
    enabled: !!query, 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const q = form.get("q")?.trim();
    if (q) setSearchParams({ query: q });
  };

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Search Videos
      </Typography>
      <Box component="form" onSubmit={handleSubmit} sx={{ mb: 4 }}>
        <TextField
          name="q"
          defaultValue={query}
          placeholder="Search by title, description, tags…"
          fullWidth
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit(e);
          }}
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Search
        </Button>
      </Box>

      {isLoading && <Typography>Loading results…</Typography>}
      {isError && (
        <Typography color="error">Failed to fetch search results.</Typography>
      )}

      {!isLoading && videos.length === 0 && query && (
        <Typography>No videos found for “{query}”.</Typography>
      )}

      <Grid container spacing={2}>
        {videos.map((v) => (
          <Grid item xs={12} sm={6} md={4} key={v._id}>
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
    </Container>
  );
}
