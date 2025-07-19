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

export const createOrder = asyncHandler(async (req, res) => {
  const { plan } = req.body;

  if (!plan || !["monthly", "yearly"].includes(plan)) {
    throw new ApiError(400, "Invalid or missing plan");
  }

  const amount = plan === "yearly" ? 50000 : 5000;

  const order = await razor.orders.create({
  amount,
  currency: "INR",
  receipt: `rcpt_${Date.now()}_${req.user._id.toString().slice(-6)}`,
  notes: {
    plan,
    userId: req.user._id.toString(),
  },
});


  res.status(200).json({
    key: process.env.RAZORPAY_KEY_ID,
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
  });
});


export const verifyPayment = asyncHandler(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest("hex");

  if (expected !== razorpay_signature) {
    throw new ApiError(400, "Invalid signature");
  }

  const order = await razor.orders.fetch(razorpay_order_id);
  const { plan, userId } = order.notes;
  const now = new Date();
  const expiresAt = new Date(now.setDate(now.getDate() + (plan === "yearly" ? 365 : 30)));

  const user = await User.findByIdAndUpdate(
    userId,
    { isPremium: true, premiumExpiresAt: expiresAt },
    { new: true }
  );
  if (!user) throw new ApiError(404, "User not found");

  res.status(200).json({ success: true, data: user });
});
