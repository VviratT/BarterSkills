import React, { useState } from "react";
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
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Alert,
  FormGroup,
  FormControlLabel,
  Switch,
  Button,
} from "@mui/material";
import { useParams } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api.js";
import useAuth from "../auth/useAuth.js";
import CommentList from "../components/CommentSection/CommentList";
import RelatedVideos from "../components/WatchSidebar/RelatedVideos";
import SubscribeButton from "../components/SubscribeButton.jsx";

export default function WatchPage() {
  const { videoId } = useParams();
  const { user, setUser, fetchUser } = useAuth();
  const remainingCredits = user?.credits ?? 0;

  const qc = useQueryClient();

  // Fetch video by ID
  // WatchPage.jsx (only the query part)
  const {
    data: video,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => api.get(`/videos/${videoId}`).then((r) => r.data.data),
  });


  // Like toggle mutation
  const toggleLike = useMutation({
    mutationFn: () => api.post(`/likes/toggle/v/${videoId}`),
    onSuccess: () => qc.invalidateQueries(["video", videoId]),
  });

  // AI generation mutation
  const generateAI = useMutation({
    mutationFn: () => api.post(`/videos/${videoId}/process-ai`),
    onSuccess: () => qc.invalidateQueries(["video", videoId]),
    onError: (err) => {
      console.error("AI generation failed:", err);
      alert(
        "AI generation failed: " + (err.response?.data?.message || err.message)
      );
    },
  });

  const [showTranscript, setShowTranscript] = useState(true);
  const [showSummary, setShowSummary] = useState(true);
  const [showQuestions, setShowQuestions] = useState(true);

  if (isLoading) {
    return (
      <Container maxWidth="md" sx={{ pt: 4 }}>
        <Skeleton variant="rectangular" height={360} />
        <Skeleton width="60%" sx={{ mt: 2 }} />
        <Skeleton width="40%" />
      </Container>
    );
  }

  if (!video) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          Video not found.
        </Typography>
      </Container>
    );
  }
  if (error) {
    return (
      <Container>
        <Typography variant="h6" color="error">
          Failed to load video: {error.message}
        </Typography>
      </Container>
    );
  }

  const hasTranscript = Boolean(video.transcript);
  const hasSummary = Boolean(video.summary);
  const hasQuestions = Boolean(video.questions?.length);
  const hasAnyAI = hasTranscript || hasSummary || hasQuestions;

  return (
    <Container maxWidth="md" sx={{ pt: 4 }}>
      {/* Video player */}
      <Box sx={{ width: "100%", aspectRatio: "16/9", mb: 2 }}>
        <video
          controls
          width="100%"
          src={video.videoFile}
          style={{ borderRadius: 8 }}
        />
      </Box>

      {/* Title and uploader */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {video.title}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <Avatar src={video.owner?.avatarUrl} />
        <Typography>{video.owner?.fullName}</Typography>
        {user?._id !== video.owner?._id && (
          <SubscribeButton username={video.owner.username} />
        )}
      </Stack>

      {/* Like button and count */}
      <Stack direction="row" spacing={1} alignItems="center" mb={3}>
        <IconButton
          onClick={() => toggleLike.mutate()}
          disabled={toggleLike.isLoading}
        >
          <ThumbUpIcon color={video.isLiked ? "primary" : "inherit"} />
        </IconButton>
        <Typography>{video.likeCount} Likes</Typography>
      </Stack>

      {/* AI-generated content */}
      {!hasAnyAI ? (
        <Box textAlign="center" my={4}>
          <Alert severity="info">No AI‑generated content yet.</Alert>
          <Button
            variant="contained"
            onClick={() => generateAI.mutate()}
            disabled={generateAI.isLoading}
            sx={{ mt: 2 }}
          >
            {generateAI.isLoading ? "Generating…" : "Generate AI Insights"}
          </Button>
        </Box>
      ) : (
        <>
          <Box mb={2}>
            <Typography variant="subtitle1" gutterBottom>
              Show / Hide AI Panels:
            </Typography>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Switch
                    checked={showTranscript}
                    onChange={() => setShowTranscript((prev) => !prev)}
                  />
                }
                label="Transcript"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={showSummary}
                    onChange={() => setShowSummary((prev) => !prev)}
                  />
                }
                label="Summary"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={showQuestions}
                    onChange={() => setShowQuestions((prev) => !prev)}
                  />
                }
                label="Questions"
              />
            </FormGroup>
          </Box>

          {showTranscript && hasTranscript && (
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

          {showSummary && hasSummary && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Summary</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>{video.summary}</Typography>
              </AccordionDetails>
            </Accordion>
          )}

          {showQuestions && hasQuestions && (
            <Accordion>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography>Questions</Typography>
              </AccordionSummary>
              <AccordionDetails>
                {video.questions.map((q, i) => (
                  <Typography key={i} sx={{ mb: 1 }}>
                    • {q.question}
                  </Typography>
                ))}
              </AccordionDetails>
            </Accordion>
          )}
        </>
      )}

      <Divider sx={{ my: 3 }} />

      {/* Comments */}
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>
      <CommentList videoId={videoId} />

      {/* Related videos */}
      <RelatedVideos />

      {/* Credits (if not premium) */}
      {!video.isPremium && typeof video.remainingCredits === "number" && (
        <Box mt={3}>
          <Chip
            label={`Remaining credits: ${video.remainingCredits}`}
            variant="outlined"
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
}
