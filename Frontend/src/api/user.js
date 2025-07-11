import api from "./api";
export const getProfile        = (username) => api.get(`/users/channel/${username}`);
export const toggleSubscribe   = (channelId) => api.post(`/subscriptions/c/${channelId}`);
