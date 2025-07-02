import {asyncHandler} from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";

export const grantPremium = asyncHandler(async (req, res) => {
  const { userId, days } = req.body;

  const expiresAt = new Date(Date.now() + days * 24 * 60 * 60 * 1000);

  const user = await User.findByIdAndUpdate(
    userId,
    {
      isPremium: true,
      premiumExpiresAt: expiresAt
    },
    { new: true }
  );

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  res.status(200).json({
    success: true,
    message: `Premium granted to user ${user.username}`,
    premiumUntil: expiresAt
  });
});
