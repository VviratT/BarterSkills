import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Avatar,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function VideoCard({ video }) {
  const navigate = useNavigate();
  const hasOwner = video.owner && typeof video.owner === "object";

  return (
    <Card
      onClick={() => navigate(`/watch/${video._id}`)}
      sx={{
        cursor: "pointer",
        transition: "0.3s",
        "&:hover": { boxShadow: 6 },
      }}
    >
      <CardMedia
        component="img"
        height="180"
        image={video.thumbnail}
        alt={video.title}
      />
      <CardContent>
        <Typography variant="subtitle1" fontWeight={600}>
          {video.title}
        </Typography>
        {hasOwner ? (
          <Box display="flex" alignItems="center" mt={1}>
            <Avatar
              src={video.owner.avatarUrl}
              sx={{ width: 24, height: 24, mr: 1 }}
            />
            <Typography variant="body2" color="text.secondary">
              {video.owner.fullName}
            </Typography>
          </Box>
        ) : (
          <Typography variant="body2" color="text.secondary" mt={1}>
            Unknown Creator
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}
