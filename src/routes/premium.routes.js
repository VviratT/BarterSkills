import express from "express";
import { grantPremium } from "../controllers/premium.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const router = express.Router();

router.post("/grant", verifyJWT, grantPremium);

export default router;
