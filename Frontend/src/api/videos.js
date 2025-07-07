import client from "./client";
export const fetchVideos = () => client.get("/videos").then(r => r.data);
export const uploadVideo = formData => client.post("/videos", formData);
export const fetchVideoAI = videoId => client.get(`/videos/${videoId}/ai`);
export const processVideoAI = videoId => client.post(`/videos/${videoId}/process-ai`);
