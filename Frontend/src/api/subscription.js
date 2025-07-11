import API from "./auth";
export const toggleSub = channelId =>
  API.post(`/subscriptions/c/${channelId}`);
export const fetchSubs = channelId =>
  API.get(`/subscriptions/c/${channelId}`);
