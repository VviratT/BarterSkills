import api from "./api.js";

export const toggleSubscribe = (channelId) =>
  api.post(`/subscriptions/c/${channelId}`).then((res) => res.data);
