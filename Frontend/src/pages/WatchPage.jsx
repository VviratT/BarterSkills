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
  Paper,
  Grid,
  Card,
  CardContent,
  Fab,
  Tooltip,
  Badge,
  LinearProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ShareIcon from "@mui/icons-material/Share";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api.js";
import useAuth from "../auth/useAuth.js";
import CommentList from "../components/CommentSection/CommentList";
import RelatedVideos from "../components/WatchSidebar/RelatedVideos";
import SubscribeButton from "../components/SubscribeButton.jsx";
import { Link } from "react-router-dom";
import {
  PlayArrow,
  Visibility,
  CalendarToday,
  Person,
  AutoAwesome,
  SmartToy,
  MoreVert,
  Download,
  Report,
  ContentCopy,
  Facebook,
  Twitter,
  LinkedIn,
  WhatsApp,
} from "@mui/icons-material";

export default function WatchPage() {
  const { videoId } = useParams();
  const { user, setUser, fetchUser } = useAuth();
  const remainingCredits = user?.credits ?? 0;

  const qc = useQueryClient();

  // Fetch video by ID
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
  const [showShareMenu, setShowShareMenu] = useState(false);

  if (isLoading) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Container maxWidth="xl" sx={{ pt: 2, px: { xs: 1, sm: 2, md: 3 } }}>
          <Grid container spacing={3}>
            <Grid item xs={12} lg={8}>
              <Skeleton
                variant="rectangular"
                height={450}
                sx={{ borderRadius: 3 }}
              />
              <Box sx={{ mt: 2 }}>
                <Skeleton width="80%" height={32} sx={{ mb: 1 }} />
                <Skeleton width="60%" height={24} />
              </Box>
            </Grid>
            <Grid item xs={12} lg={4}>
              <Stack spacing={2}>
                {Array.from({ length: 4 }).map((_, i) => (
                  <Skeleton
                    key={i}
                    variant="rectangular"
                    height={120}
                    sx={{ borderRadius: 2 }}
                  />
                ))}
              </Stack>
            </Grid>
          </Grid>
        </Container>
      </Box>
    );
  }

  if (!video) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <Typography variant="h4" color="error" mb={2}>
              Video Not Found
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              The video you're looking for doesn't exist or has been removed.
            </Typography>
            <Button variant="contained" component={Link} to="/">
              Go Home
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          width: "100%",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Container maxWidth="md">
          <Paper
            elevation={0}
            sx={{
              p: 6,
              textAlign: "center",
              borderRadius: 3,
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
            }}
          >
            <Typography variant="h4" color="error" mb={2}>
              Failed to Load Video
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              {error.message}
            </Typography>
            <Button
              variant="contained"
              onClick={() => window.location.reload()}
            >
              Try Again
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  const hasTranscript = Boolean(video.transcript);
  const hasSummary = Boolean(video.summary);
  const hasQuestions = Boolean(video.questions?.length);
  const hasAnyAI = hasTranscript || hasSummary || hasQuestions;

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const formatDate = (date) => {
    const now = new Date();
    const videoDate = new Date(date);
    const diffTime = Math.abs(now - videoDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
  };

  return (
    <Box
      sx={{ width: "100%", minHeight: "100vh", bgcolor: "background.default" }}
    >
      <Container maxWidth="xl" sx={{ pt: 2, px: { xs: 1, sm: 2, md: 3 } }}>
        <Grid container spacing={3}>
          {/* Main Content */}
          <Grid item xs={12} lg={8}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Video Player */}
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                  mb: 3,
                  position: "relative",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    aspectRatio: "16/9",
                    position: "relative",
                  }}
                >
                  <video
                    controls
                    width="100%"
                    height="100%"
                    src={video.videoFile}
                    style={{
                      borderRadius: 12,
                      objectFit: "cover",
                    }}
                  />

                  {/* Premium Badge */}
                  {video.isPremium && (
                    <Chip
                      label="Premium"
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 16,
                        right: 16,
                        backgroundColor: "rgba(245, 158, 11, 0.95)",
                        color: "white",
                        fontWeight: 600,
                        fontSize: "0.75rem",
                        backdropFilter: "blur(10px)",
                      }}
                    />
                  )}

                  {/* AI Processing Indicator */}
                  {generateAI.isLoading && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 16,
                        left: 16,
                        backgroundColor: "rgba(0, 0, 0, 0.8)",
                        color: "white",
                        px: 2,
                        py: 1,
                        borderRadius: 2,
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                      }}
                    >
                      <SmartToy sx={{ fontSize: 16 }} />
                      <Typography variant="caption">
                        Processing AI...
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Paper>

              {/* Video Info Section */}
              <Box mb={4}>
                {/* Title */}
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    mb: 2,
                    lineHeight: 1.3,
                    color: "text.primary",
                  }}
                >
                  {video.title}
                </Typography>

                {/* Stats and Actions Bar */}
                <Paper
                  elevation={0}
                  sx={{
                    p: 3,
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    mb: 3,
                  }}
                >
                  <Stack direction="row" alignItems="center" spacing={2} mb={3}>
                    <Avatar
                      src={video.owner?.avatarUrl}
                      sx={{
                        width: 48,
                        height: 48,
                        border: "2px solid rgba(99, 102, 241, 0.2)",
                      }}
                    />
                    <Box sx={{ flexGrow: 1 }}>
                      <Link
                        to={`/profile/${video.owner.username}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        <Typography
                          variant="h6"
                          sx={{
                            cursor: "pointer",
                            fontWeight: 600,
                            "&:hover": {
                              color: "primary.main",
                            },
                          }}
                        >
                          {video.owner?.fullName}
                        </Typography>
                      </Link>
                      <Typography variant="body2" color="text.secondary">
                        @{video.owner?.username} • {formatDate(video.createdAt)}
                      </Typography>
                    </Box>
                    {user?._id !== video.owner?._id && (
                      <SubscribeButton username={video.owner.username} />
                    )}
                  </Stack>

                  {/* Video Stats */}
                  <Stack direction="row" spacing={3} alignItems="center" mb={3}>
                    <Box display="flex" alignItems="center">
                      <Visibility
                        sx={{ fontSize: 20, mr: 1, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {formatNumber(video.views || 0)} views
                      </Typography>
                    </Box>

                    <Box display="flex" alignItems="center">
                      <ThumbUpIcon
                        sx={{ fontSize: 20, mr: 1, color: "text.secondary" }}
                      />
                      <Typography variant="body2" color="text.secondary">
                        {formatNumber(video.likeCount || 0)} likes
                      </Typography>
                    </Box>
                  </Stack>

                  {/* Action Buttons */}
                  <Stack direction="row" spacing={2} alignItems="center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant={video.isLiked ? "contained" : "outlined"}
                        startIcon={<ThumbUpIcon />}
                        onClick={() => toggleLike.mutate()}
                        disabled={toggleLike.isLoading}
                        sx={{
                          borderRadius: 2,
                          px: 3,
                          py: 1,
                          fontWeight: 600,
                        }}
                      >
                        {video.likeCount || 0}
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outlined"
                        startIcon={<ThumbDownIcon />}
                        sx={{
                          borderRadius: 2,
                          px: 3,
                          py: 1,
                          fontWeight: 600,
                        }}
                      >
                        Dislike
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outlined"
                        startIcon={<ShareIcon />}
                        onClick={() => setShowShareMenu(!showShareMenu)}
                        sx={{
                          borderRadius: 2,
                          px: 3,
                          py: 1,
                          fontWeight: 600,
                        }}
                      >
                        Share
                      </Button>
                    </motion.div>

                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Button
                        variant="outlined"
                        startIcon={<BookmarkIcon />}
                        sx={{
                          borderRadius: 2,
                          px: 3,
                          py: 1,
                          fontWeight: 600,
                        }}
                      >
                        Save
                      </Button>
                    </motion.div>

                    <Box sx={{ flexGrow: 1 }} />

                    <IconButton
                      sx={{
                        backgroundColor: "rgba(99, 102, 241, 0.1)",
                        "&:hover": {
                          backgroundColor: "rgba(99, 102, 241, 0.2)",
                        },
                      }}
                    >
                      <MoreVert />
                    </IconButton>
                  </Stack>

                  {/* Share Menu */}
                  <AnimatePresence>
                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <Divider sx={{ my: 2 }} />
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Typography variant="body2" color="text.secondary">
                            Share to:
                          </Typography>
                          <IconButton size="small" sx={{ color: "#1877F2" }}>
                            <Facebook />
                          </IconButton>
                          <IconButton size="small" sx={{ color: "#1DA1F2" }}>
                            <Twitter />
                          </IconButton>
                          <IconButton size="small" sx={{ color: "#0077B5" }}>
                            <LinkedIn />
                          </IconButton>
                          <IconButton size="small" sx={{ color: "#25D366" }}>
                            <WhatsApp />
                          </IconButton>
                          <IconButton size="small">
                            <ContentCopy />
                          </IconButton>
                        </Stack>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </Paper>

                {/* AI Content Section */}
                <AnimatePresence mode="wait">
                  {!hasAnyAI ? (
                    <motion.div
                      key="no-ai"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          p: 4,
                          textAlign: "center",
                          borderRadius: 3,
                          background:
                            "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          mb: 4,
                        }}
                      >
                        <SmartToy
                          sx={{ fontSize: 64, color: "primary.main", mb: 2 }}
                        />
                        <Typography variant="h6" mb={2}>
                          No AI-generated content yet
                        </Typography>
                        <Typography
                          variant="body1"
                          color="text.secondary"
                          mb={3}
                        >
                          Generate AI-powered insights including transcript,
                          summary, and questions for this video.
                        </Typography>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="contained"
                            startIcon={<AutoAwesome />}
                            onClick={() => generateAI.mutate()}
                            disabled={generateAI.isLoading}
                            sx={{
                              borderRadius: 2,
                              px: 4,
                              py: 1.5,
                              fontWeight: 600,
                              background:
                                "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
                              "&:hover": {
                                background:
                                  "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
                              },
                            }}
                          >
                            {generateAI.isLoading
                              ? "Generating..."
                              : "Generate AI Insights"}
                          </Button>
                        </motion.div>
                      </Paper>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="ai-content"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Paper
                        elevation={0}
                        sx={{
                          borderRadius: 3,
                          background:
                            "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)",
                          backdropFilter: "blur(10px)",
                          border: "1px solid rgba(255, 255, 255, 0.2)",
                          mb: 4,
                          overflow: "hidden",
                        }}
                      >
                        <Box
                          sx={{
                            p: 3,
                            background:
                              "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
                            borderBottom: "1px solid rgba(99, 102, 241, 0.1)",
                          }}
                        >
                          <Box display="flex" alignItems="center" mb={2}>
                            <AutoAwesome
                              sx={{
                                fontSize: 28,
                                color: "primary.main",
                                mr: 2,
                              }}
                            />
                            <Typography variant="h6" fontWeight={600}>
                              AI-Generated Insights
                            </Typography>
                          </Box>

                          <FormGroup row>
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={showTranscript}
                                  onChange={() =>
                                    setShowTranscript((prev) => !prev)
                                  }
                                />
                              }
                              label="Transcript"
                            />
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={showSummary}
                                  onChange={() =>
                                    setShowSummary((prev) => !prev)
                                  }
                                />
                              }
                              label="Summary"
                            />
                            <FormControlLabel
                              control={
                                <Switch
                                  checked={showQuestions}
                                  onChange={() =>
                                    setShowQuestions((prev) => !prev)
                                  }
                                />
                              }
                              label="Questions"
                            />
                          </FormGroup>
                        </Box>

                        <Box sx={{ p: 3 }}>
                          <AnimatePresence mode="wait">
                            {showTranscript && hasTranscript && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Accordion
                                  sx={{
                                    mb: 2,
                                    borderRadius: 2,
                                    boxShadow: "none",
                                    border: "1px solid rgba(0,0,0,0.1)",
                                  }}
                                >
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                  >
                                    <Typography fontWeight={600}>
                                      📝 Transcript
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <Typography
                                      sx={{
                                        whiteSpace: "pre-wrap",
                                        lineHeight: 1.6,
                                      }}
                                    >
                                      {video.transcript}
                                    </Typography>
                                  </AccordionDetails>
                                </Accordion>
                              </motion.div>
                            )}

                            {showSummary && hasSummary && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Accordion
                                  sx={{
                                    mb: 2,
                                    borderRadius: 2,
                                    boxShadow: "none",
                                    border: "1px solid rgba(0,0,0,0.1)",
                                  }}
                                >
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                  >
                                    <Typography fontWeight={600}>
                                      📋 Summary
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <Typography sx={{ lineHeight: 1.6 }}>
                                      {video.summary}
                                    </Typography>
                                  </AccordionDetails>
                                </Accordion>
                              </motion.div>
                            )}

                            {showQuestions && hasQuestions && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                              >
                                <Accordion
                                  sx={{
                                    borderRadius: 2,
                                    boxShadow: "none",
                                    border: "1px solid rgba(0,0,0,0.1)",
                                  }}
                                >
                                  <AccordionSummary
                                    expandIcon={<ExpandMoreIcon />}
                                  >
                                    <Typography fontWeight={600}>
                                      ❓ Questions
                                    </Typography>
                                  </AccordionSummary>
                                  <AccordionDetails>
                                    <Stack spacing={1}>
                                      {video.questions.map((q, i) => (
                                        <Typography
                                          key={i}
                                          sx={{ lineHeight: 1.6 }}
                                        >
                                          • {q.question}
                                        </Typography>
                                      ))}
                                    </Stack>
                                  </AccordionDetails>
                                </Accordion>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </Box>
                      </Paper>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Comments Section */}
                <Paper
                  elevation={0}
                  sx={{
                    borderRadius: 3,
                    background:
                      "linear-gradient(135deg, rgba(255, 255, 255, 0.9) 0%, rgba(255, 255, 255, 0.95) 100%)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    mb: 4,
                  }}
                >
                  <Box sx={{ p: 3 }}>
                    <Typography variant="h6" fontWeight={600} mb={3}>
                      💬 Comments
                    </Typography>
                    <CommentList videoId={videoId} />
                  </Box>
                </Paper>

                {/* Credits Info */}
                {!video.isPremium &&
                  typeof video.remainingCredits === "number" && (
                    <Paper
                      elevation={0}
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: "rgba(99, 102, 241, 0.1)",
                        border: "1px solid rgba(99, 102, 241, 0.2)",
                        textAlign: "center",
                      }}
                    >
                      <Typography
                        variant="body2"
                        color="primary"
                        fontWeight={600}
                        mb={1}
                      >
                        Remaining Credits: {video.remainingCredits}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Upgrade to Premium for unlimited AI insights
                      </Typography>
                    </Paper>
                  )}
              </Box>
            </motion.div>
          </Grid>

          {/* Sidebar */}
          <Grid item xs={12} lg={4}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <RelatedVideos />
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* Floating Action Button for Mobile */}
      <Fab
        color="primary"
        aria-label="share"
        sx={{
          position: "fixed",
          bottom: 16,
          right: 16,
          display: { xs: "flex", lg: "none" },
          background: "linear-gradient(135deg, #6366F1 0%, #8B5CF6 100%)",
        }}
        onClick={() => setShowShareMenu(!showShareMenu)}
      >
        <ShareIcon />
      </Fab>
    </Box>
  );
}
