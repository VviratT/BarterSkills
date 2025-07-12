import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  Skeleton,
  IconButton,
  Divider,
  Chip,
  Stack,
  Container,
  Collapse,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
} from "@mui/material";
import { useParams } from "react-router-dom";
import axios from "axios";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CommentList from "../components/CommentSection/CommentList";
import { Grid, useMediaQuery, useTheme } from "@mui/material";
import RelatedVideos from "../components/WatchSidebar/RelatedVideos";
import api from "../api/api.js";
import useAuth from "../auth/useAuth.js";


const WatchPage = () => {
  const { videoId } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const remainingCredits = user?.credits ?? 0;


  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await api.get(`/videos/${videoId}`);
        setVideo(res.data.data);
      } catch (err) {
        console.error("Error fetching video:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchVideo();
  }, [videoId]);

  if (!video) {
    return (
      <Container>
        <Typography variant="h6" color="error">
           Video not found or error loading.
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ pt: 4 }}>
      {loading ? (
        <Box>
          <Skeleton variant="rectangular" height={360} />
          <Skeleton width="60%" sx={{ mt: 2 }} />
          <Skeleton width="40%" />
          <Skeleton width="100%" height={80} sx={{ mt: 2 }} />
        </Box>
      ) : (
        <Box>
          {/* Video Player */}
          <Box sx={{ width: "100%", aspectRatio: "16/9", mb: 2 }}>
            <video
              controls
              width="100%"
              src={video?.videoFile}
              style={{ borderRadius: "10px" }}
            />
          </Box>
          {/* Title */}
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            {video.title}
          </Typography>
          {/* Uploader Info */}
          <Stack direction="row" alignItems="center" spacing={2} mb={2}>
            <Avatar src={video.owner?.avatarUrl} />
            <Typography variant="subtitle1">{video.owner?.fullName}</Typography>
          </Stack>
          {/* Like/Dislike */}
          <Stack direction="row" spacing={2} alignItems="center">
            <IconButton>
              <ThumbUpIcon />
            </IconButton>
            <IconButton>
              <ThumbDownIcon />
            </IconButton>
          </Stack>
          {video.transcript || video.summary || video.questions?.length > 0 ? (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                AI Generated Insights
              </Typography>

              {/* Transcript */}
              {video.transcript && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Transcript</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography sx={{ whiteSpace: "pre-wrap" }}>
                      {video.transcript}
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              )}

              {/* Summary */}
              {video.summary && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Summary</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>{video.summary}</Typography>
                  </AccordionDetails>
                </Accordion>
              )}

              {/* Questions */}
              {video.questions?.length > 0 && (
                <Accordion>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Generated Questions</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Box>
                      {video.questions.map((q, idx) => (
                        <Typography key={idx} sx={{ mb: 1 }}>
                          • {q.question}
                        </Typography>
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              )}
            </Box>
          ) : (
            <Alert severity="info" sx={{ mt: 3 }}>
              This video does not yet have AI-generated content.
            </Alert>
          )}
          // Remaining Credits Display (if applicable)
          {video.remainingCredits !== undefined && (
            <Box sx={{ mt: 3 }}>
              <Chip
                color="primary"
                label={`Remaining Credits: ${video.remainingCredits}`}
                variant="outlined"
              />
            </Box>
          )}
          <Divider sx={{ my: 2 }} />
          <Box mt={4}>
            <Typography variant="h6" gutterBottom>
              Comments
            </Typography>
            <CommentList videoId={video._id} />
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              {/* Video player, AI content, comments */}
            </Grid>
            <Grid item xs={12} md={4}>
              <RelatedVideos />
            </Grid>
          </Grid>
          {!video?.isPremium && (
            <Typography variant="caption" color="text.secondary" mt={1}>
              Remaining credits: {remainingCredits}
            </Typography>
          )}

          
        </Box>
      )}
    </Container>
  );
};

export default WatchPage;
