import { Avatar, Box, Typography, IconButton, Tooltip } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";

const CommentItem = ({ comment, isOwner, onEdit, onDelete }) => {
  return (
    <Box display="flex" gap={2} mb={2}>
      <Avatar src={comment.owner?.avatarUrl} alt={comment.owner?.fullName} />
      <Box flex={1}>
        <Typography fontWeight="medium">{comment.owner?.fullName}</Typography>
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
            <IconButton onClick={() => onEdit(comment)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton onClick={() => onDelete(comment._id)}>
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </Box>
      )}
    </Box>
  );
};

export default CommentItem;
