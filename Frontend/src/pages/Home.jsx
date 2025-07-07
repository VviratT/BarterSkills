// src/pages/Home.jsx
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export default function Home() {
  const queryClient = useQueryClient();
  const [files, setFiles] = useState({ video: null, thumbnail: null });
  const [meta, setMeta] = useState({ title: "", description: "" });

  // Fetch recent videos
  const { data, isLoading } = useQuery(["videos"], () =>
    axios.get("/api/v1/videos").then((res) => res.data.data)
  );

  // Mutation for upload
  const uploadMutation = useMutation(
    () => {
      const form = new FormData();
      form.append("videoFile", files.video);
      form.append("thumbnail", files.thumbnail);
      form.append("title", meta.title);
      form.append("description", meta.description);
      return axios.post("/api/v1/videos", form, {
        headers: { "Content-Type": "multipart/form-data" },
      });
    },
    {
      onSuccess: () => {
        setFiles({ video: null, thumbnail: null });
        setMeta({ title: "", description: "" });
        queryClient.invalidateQueries(["videos"]);
      },
    }
  );

  const handleFileChange = (e) => {
    setFiles((f) => ({ ...f, [e.target.name]: e.target.files[0] }));
  };

  const handleMetaChange = (e) => {
    setMeta((m) => ({ ...m, [e.target.name]: e.target.value }));
  };

  const handleUpload = () => uploadMutation.mutate();

  return (
    <Container sx={{ mt: 4 }}>
      <Typography variant="h4" mb={2}>
        Upload a Video
      </Typography>
      <Box display="flex" flexDirection="column" gap={2} mb={4}>
        <TextField
          label="Title"
          name="title"
          value={meta.title}
          onChange={handleMetaChange}
          fullWidth
        />
        <TextField
          label="Description"
          name="description"
          value={meta.description}
          onChange={handleMetaChange}
          fullWidth
          multiline
          rows={2}
        />
        <Button variant="outlined" component="label">
          Select Video
          <input
            hidden
            type="file"
            name="video"
            accept="video/*"
            onChange={handleFileChange}
          />
        </Button>
        <Typography variant="body2">{files.video?.name}</Typography>
        <Button variant="outlined" component="label">
          Select Thumbnail
          <input
            hidden
            type="file"
            name="thumbnail"
            accept="image/*"
            onChange={handleFileChange}
          />
        </Button>
        <Typography variant="body2">{files.thumbnail?.name}</Typography>
        <Button
          variant="contained"
          onClick={handleUpload}
          disabled={
            !files.video || !files.thumbnail || uploadMutation.isLoading
          }
        >
          {uploadMutation.isLoading ? "Uploading…" : "Upload"}
        </Button>
      </Box>

      <Typography variant="h5" mb={2}>
        Recent Videos
      </Typography>
      {isLoading ? (
        <Typography>Loading videos…</Typography>
      ) : (
        <Grid container spacing={3}>
          {data.map((v) => (
            <Grid key={v._id} item xs={12} sm={6} md={4}>
              <Card>
                <CardMedia
                  component="img"
                  height="140"
                  image={v.thumbnail}
                  alt={v.title}
                />
                <CardContent>
                  <Typography variant="h6">{v.title}</Typography>
                  <Typography variant="body2" color="text.secondary" noWrap>
                    {v.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
}
