import API from "./auth";
export const fetchComments = (videoId, params) =>
  API.get(`/comments/${videoId}`, { params });
export const postComment = (videoId, content) =>
  API.post(`/comments/${videoId}`, { content });
