import cron from "node-cron";
import { User } from "../models/user.model.js";

const checkAndExpirePremiums = async () => {
    try {
        const now = new Date();
        const expiredUsers = await User.find({
            "premium.isActive": true,
            "premium.expiresAt": { $lt: now }
        });

        for (const user of expiredUsers) {
            user.premium.isActive = false;
            user.premium.expiresAt = null;
            await user.save();
        }

        if (expiredUsers.length > 0) {
            console.log(`Expired premium for ${expiredUsers.length} user(s) at ${now}`);
        }
    } catch (error) {
        console.error("Error in premium expiry job:", error.message);
    }
};

export const schedulePremiumExpiryJob = () => {
    cron.schedule("0 0 * * *", checkAndExpirePremiums);
};
