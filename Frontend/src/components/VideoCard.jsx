import React from "react";
import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Avatar,
  Box,
  Chip,
  Stack,
  IconButton,
  Tooltip,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";

export default function VideoCard({ video }) {
  const nav = useNavigate();

  const handleCardClick = () => {
    nav(`/watch/${video._id}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -8 }}
      style={{ height: "100%" }}
    >
      <Card
        onClick={handleCardClick}
        sx={{
          cursor: "pointer",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
          "&:hover .play-overlay": {
            opacity: 1,
          },
        }}
      >
        {/* Video Thumbnail with Play Overlay */}
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            height="200"
            image={video.thumbnail}
            sx={{
              objectFit: "cover",
              transition: "transform 0.3s ease-in-out",
            }}
            className="card-media"
          />

          {/* Play Button Overlay */}
          <Box
            className="play-overlay"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: 0,
              transition: "opacity 0.3s ease-in-out",
            }}
          >
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
              <IconButton
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  color: "primary.main",
                  width: 60,
                  height: 60,
                  "&:hover": {
                    backgroundColor: "white",
                    transform: "scale(1.1)",
                  },
                }}
              >
                <PlayArrowIcon sx={{ fontSize: 30 }} />
              </IconButton>
            </motion.div>
          </Box>

          {/* Premium Badge */}
          {video.isPremium && (
            <Chip
              label="Premium"
              size="small"
              sx={{
                position: "absolute",
                top: 12,
                right: 12,
                backgroundColor: "rgba(245, 158, 11, 0.9)",
                color: "white",
                fontWeight: 600,
                fontSize: "0.75rem",
              }}
            />
          )}

          {/* Duration Badge */}
          {video.duration && (
            <Box
              sx={{
                position: "absolute",
                bottom: 8,
                right: 8,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                color: "white",
                px: 1,
                py: 0.5,
                borderRadius: 1,
                fontSize: "0.75rem",
                fontWeight: 500,
              }}
            >
              {video.duration}
            </Box>
          )}
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          {/* Title */}
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              lineHeight: 1.3,
              mb: 1,
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              textOverflow: "ellipsis",
            }}
          >
            {video.title}
          </Typography>

          {/* Description */}
          {video.description && (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{
                mb: 2,
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {video.description}
            </Typography>
          )}

          {/* Creator Info */}
          <Box display="flex" alignItems="center" mb={2}>
            <Avatar
              src={video.owner?.avatarUrl}
              sx={{
                width: 32,
                height: 32,
                mr: 1.5,
                border: "2px solid rgba(99, 102, 241, 0.2)",
              }}
            />
            <Box sx={{ flexGrow: 1 }}>
              <Typography
                variant="body2"
                sx={{
                  fontWeight: 500,
                  color: "text.primary",
                }}
              >
                {video.owner?.fullName}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {video.owner?.username}
              </Typography>
            </Box>
          </Box>

          {/* Stats */}
          <Stack direction="row" spacing={2} alignItems="center">
            <Box display="flex" alignItems="center">
              <VisibilityIcon
                sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }}
              />
              <Typography variant="caption" color="text.secondary">
                {video.views || 0} views
              </Typography>
            </Box>

            <Box display="flex" alignItems="center">
              <ThumbUpIcon
                sx={{ fontSize: 16, mr: 0.5, color: "text.secondary" }}
              />
              <Typography variant="caption" color="text.secondary">
                {video.likeCount || 0} likes
              </Typography>
            </Box>
          </Stack>

          {/* Upload Date */}
          {video.createdAt && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{
                display: "block",
                mt: 1,
              }}
            >
              {new Date(video.createdAt).toLocaleDateString()}
            </Typography>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
