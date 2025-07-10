import express from "express";
import {
  sendMessage,
  getConversation,
  markAsRead
} from "../controllers/message.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(verifyJWT);

router.post("/:receiverId", sendMessage);

router.get("/:otherUserId", getConversation);

router.patch("/read/:otherUserId", markAsRead);

export default router;
