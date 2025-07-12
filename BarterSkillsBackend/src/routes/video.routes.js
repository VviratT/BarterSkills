import { Router } from "express";
import {
  getAllVideos,
  getSingleVideo,
  publishAVideo,
  updateVideo,
  deleteVideo,
  watchVideo,
  processVideoAI,
  getVideoAI,
  togglePublishStatus,
} from "../controllers/video.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const router = Router();

// Public
router.get("/", getAllVideos);
router.get("/:videoId", getSingleVideo);

// All routes below require auth
router.use(verifyJWT);

router.post(
  "/",
  upload.fields([
    { name: "videoFile", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),
  publishAVideo
);
router.patch("/:videoId", upload.single("thumbnail"), updateVideo);
router.delete("/:videoId", deleteVideo);
router.post("/:videoId/watch", watchVideo);
router.patch("/toggle/publish/:videoId", togglePublishStatus);
router.get("/:videoId/ai", getVideoAI);
router.post("/:videoId/process-ai", processVideoAI);

export default router;
