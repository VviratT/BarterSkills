import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  InputLabel,
  LinearProgress,
  Card,
  CardContent,
  CardHeader,
  IconButton,
} from "@mui/material";
import {
  CloudUpload as CloudUploadIcon,
  PhotoCamera,
  Movie,
} from "@mui/icons-material";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Upload = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const uploadMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      formData.append("thumbnail", thumbnail);
      formData.append("videoFile", videoFile);

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/videos`,
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setUploadProgress(percent);
          },
        }
      );
      return res.data;
    },
    onSuccess: () => {
      alert("✅ Video uploaded!");
      navigate("/dashboard");
    },
    onError: (err) => {
      console.error(err);
      alert("❌ Upload failed. Check console.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !description || !thumbnail || !videoFile) {
      alert("Please fill all fields.");
      return;
    }
    uploadMutation.mutate();
  };

  return (
    <Box mt={6} display="flex" justifyContent="center" margin={"50px"}>
      <Card
        sx={{ width: "100%", maxWidth: 600, boxShadow: 4, borderRadius: 3 }}
      >
        <CardHeader
          title="Upload Video"
          subheader="Share your skills with the community"
          sx={{ textAlign: "center" }}
        />
        <CardContent>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="Title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                fullWidth
              />
              <TextField
                label="Description"
                multiline
                minRows={3}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                fullWidth
              />

              <Box>
                <InputLabel>Thumbnail</InputLabel>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<PhotoCamera />}
                  fullWidth
                >
                  {thumbnail ? thumbnail.name : "Choose Image"}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={(e) => setThumbnail(e.target.files[0])}
                  />
                </Button>
              </Box>

              <Box>
                <InputLabel>Video File</InputLabel>
                <Button
                  variant="outlined"
                  component="label"
                  startIcon={<Movie />}
                  fullWidth
                >
                  {videoFile ? videoFile.name : "Choose Video"}
                  <input
                    type="file"
                    hidden
                    accept="video/*"
                    onChange={(e) => setVideoFile(e.target.files[0])}
                  />
                </Button>
              </Box>

              {uploadMutation.isPending && (
                <Box>
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                  />
                  <Typography variant="body2" align="center" mt={1}>
                    {uploadProgress}%
                  </Typography>
                </Box>
              )}

              <Button
                type="submit"
                variant="contained"
                size="large"
                startIcon={<CloudUploadIcon />}
                disabled={uploadMutation.isPending}
                sx={{ py: 1.2 }}
              >
                {uploadMutation.isPending ? "Uploading..." : "Upload Video"}
              </Button>
            </Stack>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Upload;
