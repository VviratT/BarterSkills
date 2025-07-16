import api from "./api.js";

export const fetchConversations = () => api.get("/messages/conversations").then(r => r.data.data);
export const fetchConversation = convId => api.get(`/messages/${convId}`).then(r => r.data.data);
export const postMessage = (convId, text) => api.post(`/messages/${convId}`, { text }).then(r => r.data.data);
export const createConversation = otherUserId => api.post("/messages", { otherUserId }).then(r => r.data.data.convoId);
