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

export const createSubscription = asyncHandler(async (req, res) => {
  const { plan } = req.body;
  if (!["monthly", "yearly"].includes(plan)) {
    throw new ApiError(400, "Plan must be 'monthly' or 'yearly'");
  }

  const planId =
    plan === "monthly"
      ? process.env.RAZORPAY_PLAN_MONTHLY
      : process.env.RAZORPAY_PLAN_YEARLY;

  
  const customer = await razor.customers.create({
    name:  req.user.fullName,
    email: req.user.email,
  });


  const subscription = await razor.subscriptions.create({
    plan_id:         planId,
    customer_notify: 1,                
    total_count:     plan === "monthly" ? 12 : 1,
    customer_id:     customer.id,    
    notes:           { userId: req.user._id.toString() },
  });

  res.status(200).json(
    new ApiResponse({
      data:    { subscription },
      message: "Subscription created",
    })
  );
});


export const razorpayWebhook = asyncHandler(async (req, res) => {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  const body   = JSON.stringify(req.body);
  const signature = req.headers["x-razorpay-signature"];
  const expected = crypto
    .createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  if (signature !== expected) {
    return res.status(400).json({ success: false, message: "Invalid signature" });
  }

  const event = req.body.event;
  const payload = req.body.payload;

  if (event === "subscription.charged") {
    const sub = payload.subscription.entity;
    const userId = sub.notes.userId;
   
    const expiresAt = new Date(sub.current_end * 1000);

    await User.findByIdAndUpdate(userId, {
      isPremium: true,
      premiumExpiresAt: expiresAt
    });
    console.log(`✅ User ${userId} premium until ${expiresAt}`);
  }

  res.json({ success: true });
});
