import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  getConversations,
  getConversation,
  createConversation,
  postMessage,
  getGlobalHistory, 
} from "../controllers/message.controllers.js";

const router = Router();

router.get("/global", verifyJWT, getGlobalHistory);

router.use(verifyJWT);

router.get("/conversations", getConversations);
router.post("/", createConversation);
router.get("/:convId", getConversation);
router.post("/:convId", postMessage);

export default router;
