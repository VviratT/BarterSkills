import React from "react";
import { Box, Avatar, Typography, IconButton, Tooltip } from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";

export default function CommentItem({ comment, isOwner, onEdit, onDelete }) {
  return (
    <Box display="flex" gap={2} mb={2}>
      <Avatar src={comment.owner.avatarUrl} />
      <Box flex={1}>
        <Typography fontWeight="medium">{comment.owner.fullName}</Typography>
        <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
          {comment.content}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          {new Date(comment.createdAt).toLocaleString()}
        </Typography>
      </Box>
      {isOwner && (
        <Box>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => onEdit(comment)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => onDelete(comment._id)}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
}
