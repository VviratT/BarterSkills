import API from "./auth";
export const chatAI = userMessage => API.post("/ai/chat", { message: userMessage });
