import { Router } from "express";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { createOrder, verifyPayment } from "../controllers/billing.controller.js";

const router = Router();

router.post("/create-order", verifyJWT, createOrder);
router.post("/verify-payment", verifyJWT, verifyPayment);

export default router;
