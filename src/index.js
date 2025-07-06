import path from "path";
import dotenv from "dotenv";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.resolve(__dirname, "../.env") });


import connectDB from "./db/index.js";
import { app } from "./app.js";

import { createServer } from "http";
import { Server as IOServer } from "socket.io";
import jwt from "jsonwebtoken";
import { User } from "./models/user.model.js";

const httpServer = createServer(app);

const io = new IOServer(httpServer, {
  cors: {
    origin: process.env.CORS_ORIGIN,
    methods: ["GET", "POST"],
    credentials: true,
  },
});


io.use(async (socket, next) => {
  try {
    const token = socket.handshake.auth.token;
    if (!token) throw new Error("No auth token");

    const payload = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(payload._id).select("-password -refreshToken");
    if (!user) throw new Error("Invalid token");
    socket.user = user;
    next();
  } catch (err) {
    console.error("Socket auth error:", err.message);
    next(new Error("Authentication error"));
  }
});

io.on("connection", (socket) => {
  console.log(`🔗 User connected: ${socket.user.username}`);

  socket.join("global");

  socket.on("message", (text) => {
    const msg = {
      user: {
        _id: socket.user._id,
        username: socket.user.username,
      },
      text,
      createdAt: new Date(),
    };
    io.to("global").emit("message", msg);
  });

  socket.on("disconnect", () => {
    console.log(`❌ User disconnected: ${socket.user.username}`);
  });
});

connectDB()
  .then(() => {
    const port = process.env.PORT || 8000;
    httpServer.listen(port, () => {
      console.log(`⚙️ Server running on port ${port}`);
    });
  })
  .catch((err) => {
    console.error("MONGO db connection failed:", err);
  });
