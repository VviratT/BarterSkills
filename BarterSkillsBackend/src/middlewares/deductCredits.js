import {User} from "../models/user.model.js";

export const deductCredits = async (req, res, next) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized: user not found" });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Do not deduct for premium users
    if (user.isPremium) {
      return next();
    }

    if (user.credits <= 0) {
      return res.status(403).json({ message: "Insufficient credits" });
    }

    user.credits -= 1;
    await user.save();

    next();
  } catch (err) {
    console.error("Error deducting credits:", err);
    res.status(500).json({ message: "Failed to deduct credits" });
  }
};
