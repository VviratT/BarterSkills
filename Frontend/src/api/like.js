import API from "./auth";
export const toggleLikeVideo = videoId =>
  API.post(`/likes/toggle/v/${videoId}`);
export const fetchLikedVideos = () =>
  API.get("/likes/videos");
