import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createSubscription, razorpayWebhook } from "../controllers/billing.controller.js";
import bodyParser from "body-parser";

const router = Router();

router.post(
  "/razorpay/webhook",
  bodyParser.json({ type: "application/json" }),
  razorpayWebhook
);

router.post("/razorpay/subscribe", verifyJWT, createSubscription);

export default router;
