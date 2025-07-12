import { Router } from "express";
import { getDashboardStats, getDashboardVideos } from "../controllers/dashboard.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = Router();

router.use(verifyJWT); 

router.get("/stats", getDashboardStats);
router.get("/videos", getDashboardVideos);

export default router;
