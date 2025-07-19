import Razorpay from "razorpay";
import crypto from "crypto";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const razor = new Razorpay({
  key_id:    process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const PLAN_CONFIG = {
  monthly: { planId: process.env.RAZORPAY_PLAN_MONTHLY, amount: 5000, currency: "INR" },
  yearly:  { planId: process.env.RAZORPAY_PLAN_YEARLY,  amount: 50000, currency: "INR" },
};

export const createSubscription = asyncHandler(async (req, res) => {
  const { plan } = req.body;
  if (!PLAN_CONFIG[plan]) {
    throw new ApiError(400, "Plan must be 'monthly' or 'yearly'");
  }

  // 0) Don’t let already‑premium users re‑subscribe
  if (req.user.isPremium && new Date(req.user.premiumExpiresAt) > new Date()) {
    throw new ApiError(400, "You already have an active premium subscription");
  }

  const { planId, amount, currency } = PLAN_CONFIG[plan];

  // 1) Create (or reuse) customer, without throwing on duplicates
  let customer;
  try {
    customer = await razor.customers.create({
      name:          req.user.fullName,
      email:         req.user.email,
      fail_existing: false,
    });
  } catch (err) {
    // In the rare case fail_existing doesn’t catch it, fetch existing customer
    if (err.error?.code === "BAD_REQUEST_ERROR" && err.error?.description?.includes("already exists")) {
      const { items } = await razor.customers.all({ email: req.user.email, count: 1 });
      customer = items[0];
    } else {
      throw err;
    }
  }

  // 2) Create subscription
  const subscription = await razor.subscriptions.create({
    plan_id:         planId,
    customer_notify: 1,
    total_count:     plan === "monthly" ? 12 : 1,
    customer_id:     customer.id,
    notes:           { userId: req.user._id.toString() },
  });

  // 3) Return exactly what the frontend expects
  return res.status(200).json({
      key:          process.env.RAZORPAY_KEY_ID,
      subscriptionId: subscription.id,
      amount,   // use our static plan amount
      currency, // use our static plan currency
  });
});


/**
 * POST /api/v1/billing/webhook
 * Razorpay will send subscription.charged events here
 */
export const razorpayWebhook = asyncHandler(async (req, res) => {
  const secret    = process.env.RAZORPAY_KEY_SECRET;
  const body      = JSON.stringify(req.body);
  const signature = req.headers["x-razorpay-signature"];
  const expected  = crypto.createHmac("sha256", secret).update(body).digest("hex");

  if (signature !== expected) {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }

  const { event, payload } = req.body;
  if (event === "subscription.charged") {
    const sub       = payload.subscription.entity;
    const userId    = sub.notes.userId;
    const expiresAt = new Date(sub.current_end * 1000);

    await User.findByIdAndUpdate(userId, {
      isPremium:        true,
      premiumExpiresAt: expiresAt,
    });
    console.log(`✅ Premium activated for ${userId} until ${expiresAt}`);
  }

  res.json({ success: true });
});

export const verifySubscription = asyncHandler(async (req, res) => {
  const { subscriptionId } = req.body;
  if (!subscriptionId) {
    throw new ApiError(400, "subscriptionId is required");
  }

  // Fetch from Razorpay
  const subscription = await razor.subscriptions.fetch(subscriptionId);
  if (subscription.status !== "active") {
    throw new ApiError(400, "Subscription is not active yet");
  }

  // Compute expiry
  const expiresAt = new Date(subscription.current_end * 1000);

  // Update user
  const user = await User.findByIdAndUpdate(
    subscription.notes.userId,
    { isPremium: true, premiumExpiresAt: expiresAt },
    { new: true }
  );

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  // Return fresh user data
  return res.status(200).json({
    success: true,
    data: user,
  });
});