import { Router } from 'express';
import {
    deleteVideo,
    getAllVideos,
    getVideoById,
    publishAVideo,
    togglePublishStatus,
    updateVideo,
    watchVideo,
    getVideoAI,
    processVideoAI
} from "../controllers/video.controllers.js"
import {verifyJWT} from "../middlewares/auth.middleware.js"
import {upload} from "../middlewares/multer.middleware.js"

const router = Router();


router
    .route("/")
    .get(getAllVideos)

    router
    .route("/:videoId")
    .get(getVideoById)

router.use(verifyJWT); 

router
    .route("/")
    .post(
        upload.fields([
            {
                name: "videoFile",
                maxCount: 1,
            },
            {
                name: "thumbnail",
                maxCount: 1,
            },
            
        ]),
        publishAVideo
    );

router
    .route("/:videoId")
    .delete(deleteVideo)
    .patch(upload.single("thumbnail"), updateVideo);

router.route("/toggle/publish/:videoId").patch(togglePublishStatus);

router.post("/:videoId/watch", watchVideo);

router.get("/:videoId/ai", verifyJWT, getVideoAI);

router.post("/:videoId/process-ai", verifyJWT, processVideoAI);
router.get("/test-question-api", async (req, res) => {
  try {
    const response = await axios.post("http://localhost:8000/generate-questions", {
      summary: "India is a democratic country. It has 28 states and 8 union territories. The capital is New Delhi."
    });
    return res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    return res.status(500).json({ error: err.message });
  }
});

export default router