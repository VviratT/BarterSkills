import {
  Box,
  Typography,
  Card,
  CardMedia,
  CardContent,
  Skeleton,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import axios from "../../api/api";

const RelatedVideos = () => {
  const navigate = useNavigate();

  const { data, isLoading } = useQuery({
    queryKey: ["relatedVideos"],
    queryFn: async () => {
      const res = await axios.get(`/videos?limit=6&sortBy=views&sortType=desc`);
      return res.data.data;
    },
  });

  const videos = data || [];

  return (
    <Box mt={4}>
      <Typography variant="h6" mb={2}>
        Related Videos
      </Typography>
      {isLoading
        ? Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} height={100} sx={{ mb: 2 }} />
          ))
        : videos.map((video) => (
            <Card
              component={Link}
              to={`/watch/${video._id}`}
              key={video._id}
              sx={{ mb: 2, display: "flex", textDecoration: "none" }}
            >
              <CardMedia
                component="img"
                image={video.thumbnail}
                alt={video.title}
                sx={{ width: 120 }}
              />
              <CardContent sx={{ flex: 1, p: 1 }}>
                <Typography variant="subtitle2" noWrap>
                  {video.title}
                </Typography>
                <Typography
                  variant="caption"
                  color="primary"
                  sx={{ cursor: "pointer", display: "block" }}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation(); // prevent parent Link
                    navigate(`/profile/${video.owner.username}`);
                  }}
                >
                  {video.owner.fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  • {video.views} views
                </Typography>
              </CardContent>
            </Card>
          ))}
    </Box>
  );
};

export default RelatedVideos;
