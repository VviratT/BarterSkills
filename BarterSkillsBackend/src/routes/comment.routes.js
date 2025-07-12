import { Router } from "express";
import {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment,
} from "../controllers/comment.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();
router.use(verifyJWT);

router.get("/:videoId", getVideoComments);
router.post("/:videoId", addComment);
router.patch("/c/:commentId", updateComment);
router.delete("/c/:commentId", deleteComment);

export default router;
