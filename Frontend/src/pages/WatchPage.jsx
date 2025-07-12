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

export default function WatchPage() {
  const { videoId } = useParams();
  const { user } = useAuth();
  const remainingCredits = user?.credits ?? 0;
  const qc = useQueryClient();

  // Fetch the single video (with likeCount / isLiked baked in)
  const { data: video, isLoading } = useQuery({
    queryKey: ["video", videoId],
    queryFn: () => api.get(`/videos/${videoId}`).then((r) => r.data.data),
  });

  // Like mutation
  const toggleLike = useMutation({
    mutationFn: () => api.post(`/likes/toggle/v/${videoId}`),
    onSuccess: () => qc.invalidateQueries(["video", videoId]),
  });

  // AI-generation mutation
  const generateAI = useMutation({
    mutationFn: () => api.post(`/videos/${videoId}/process-ai`),
    onSuccess: () => {
      // refetch video to get transcript/summary/questions
      qc.invalidateQueries(["video", videoId]);
    },
    onError: (err) => {
     console.error("AI generation failed:", err);
     alert("AI generation failed: " + (err.response?.data?.message || err.message));
   },
  });

  // Toggles to show/hide each AI block
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

  const hasTranscript = Boolean(video.transcript);
  const hasSummary = Boolean(video.summary);
  const hasQuestions = Boolean(video.questions?.length);
  const hasAnyAI = hasTranscript || hasSummary || hasQuestions;

  return (
    <Container maxWidth="md" sx={{ pt: 4 }}>
      {/* video player */}
      <Box sx={{ width: "100%", aspectRatio: "16/9", mb: 2 }}>
        <video
          controls
          width="100%"
          src={video.videoFile}
          style={{ borderRadius: 8 }}
        />
      </Box>

      {/* title & uploader */}
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        {video.title}
      </Typography>
      <Stack direction="row" alignItems="center" spacing={2} mb={2}>
        <Avatar src={video.owner?.avatarUrl} />
        <Typography>{video.owner?.fullName}</Typography>
      </Stack>

      {/* like/button */}
      <Stack direction="row" spacing={1} alignItems="center" mb={3}>
        <IconButton
          onClick={() => toggleLike.mutate()}
          disabled={toggleLike.isLoading}
        >
          <ThumbUpIcon color={video.isLiked ? "primary" : "inherit"} />
        </IconButton>
        <Typography>{video.likeCount} Likes</Typography>
      </Stack>

      {/* AI section */}
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
              Show / hide AI panels:
            </Typography>
            <FormGroup row>
              <FormControlLabel
                control={
                  <Switch
                    checked={showTranscript}
                    onChange={() => setShowTranscript((x) => !x)}
                  />
                }
                label="Transcript"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={showSummary}
                    onChange={() => setShowSummary((x) => !x)}
                  />
                }
                label="Summary"
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={showQuestions}
                    onChange={() => setShowQuestions((x) => !x)}
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

      {/* comments */}
      <Typography variant="h6" gutterBottom>
        Comments
      </Typography>
      <CommentList videoId={videoId} />

      {/* related videos sidebar */}
      <RelatedVideos />

      {/* remaining credits */}
      {!video.isPremium && (
        <Box mt={3}>
          <Chip
            label={`Remaining credits: ${remainingCredits}`}
            variant="outlined"
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
}
