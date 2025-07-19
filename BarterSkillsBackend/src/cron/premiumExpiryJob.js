import cron from "node-cron";
import { User } from "../models/user.model.js";

const checkAndExpirePremiums = async () => {
  try {
    const now = new Date();
    const users = await User.find({
      isPremium: true,
      premiumExpiresAt: { $lt: now },
    });

    for (const u of users) {
      u.isPremium        = false;
      u.premiumExpiresAt = null;
      await u.save();
    }

    if (users.length) {
      console.log(`Expired premium for ${users.length} user(s) at ${now}`);
    }
  } catch (err) {
    console.error("Error in premium expiry job:", err);
  }
};

export const schedulePremiumExpiryJob = () => {
  cron.schedule("0 0 * * *", checkAndExpirePremiums);
};
