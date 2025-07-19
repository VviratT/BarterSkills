import { Router } from "express";
import bodyParser from "body-parser";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import {
  createSubscription,
  razorpayWebhook,
  verifySubscription 
} from "../controllers/billing.controller.js";

const router = Router();

router.post("/subscribe", verifyJWT, createSubscription);

router.post(
  "/webhook",
  bodyParser.json({ type: "application/json" }),
  razorpayWebhook
);

router.post("/verify-subscription", verifyJWT, verifySubscription);

export default router;
