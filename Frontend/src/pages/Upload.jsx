import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  InputLabel,
  LinearProgress,
} from "@mui/material";
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
          headers: {
            "Content-Type": "multipart/form-data",
          },
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
    onSuccess: (data) => {
      alert(" Video uploaded!");
      navigate("/dashboard"); 
    },
    onError: (err) => {
      console.error(err);
      alert(" Upload failed. Check console.");
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
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        Upload Video
      </Typography>

      <form onSubmit={handleSubmit}>
        <Stack spacing={2}>
          <TextField
            label="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            label="Description"
            multiline
            minRows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />

          <Box>
            <InputLabel>Thumbnail</InputLabel>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setThumbnail(e.target.files[0])}
              required
            />
          </Box>

          <Box>
            <InputLabel>Video File</InputLabel>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setVideoFile(e.target.files[0])}
              required
            />
          </Box>

          {uploadMutation.isPending && (
            <Box>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography>{uploadProgress}%</Typography>
            </Box>
          )}

          <Button
            type="submit"
            variant="contained"
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? "Uploading..." : "Upload"}
          </Button>
        </Stack>
      </form>
    </Box>
  );
};

export default Upload;
