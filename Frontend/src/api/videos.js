import api from "./api.js";

export const uploadVideo = data =>
  api.post("/videos", data, { headers: { "Content-Type": "multipart/form-data" } });

export const getVideo = id =>
  api.get(`/videos/${id}`);

export const watchVideo = id =>
  api.get(`/videos/watch/${id}`);

export const listVideos = params =>
  api.get("/videos", { params });

export const getRecommendedVideos = async ({ excludeId }) => {
  const res = await axios.get(`/videos`, {
    params: {
      limit: 10,
      sortBy: "views",
    },
  });
  return res.data.data.filter((v) => v._id !== excludeId);
};

