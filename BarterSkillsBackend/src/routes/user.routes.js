import { Router } from "express";
import { 
    loginUser, 
    logoutUser, 
    registerUser, 
    refreshAccessToken, 
    changeCurrentPassword, 
    getCurrentUser, 
    updateUserAvatar, 
    updateUserCoverImage, 
    getUserChannelProfile, 
    getWatchHistory, 
    googleCallbackHandler,
    updateAccountDetails
} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import { verifyJWT } from "../middlewares/auth.middleware.js";
import passport from "passport";
import { generateAccessAndRefereshTokens } from "../controllers/user.controller.js"; 
import dotenv from "dotenv";
dotenv.config();
import { activatePremium } from "../controllers/user.controller.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        {
            name: "avatar",
            maxCount: 1
        }, 
        {
            name: "coverImage",
            maxCount: 1
        }
    ]),
    registerUser
    )

router.route("/login").post(loginUser)


router.get("/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login", session: false }),
  async (req, res, next) => {
    try {
      // generate tokens
      const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(req.user._id);

      // redirect into your React app with tokens in query
      const redirectUrl = `${process.env.CLIENT_URL}/oauth/callback` +
        `?accessToken=${accessToken}&refreshToken=${refreshToken}`;
      return res.redirect(redirectUrl);
    } catch (err) {
      console.error("🚨 Google callback error:", err);
      next(err);
    }
  }
);



//secured routes
router.route("/logout").post(verifyJWT,  logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/change-password").post(verifyJWT, changeCurrentPassword)
router.route("/current-user").get(verifyJWT, getCurrentUser)
router.route("/update-account").patch(verifyJWT, updateAccountDetails)

router.route("/avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
router.route("/cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

router.route("/c/:username").get(verifyJWT, getUserChannelProfile)
router.route("/history").get(verifyJWT, getWatchHistory)

router.post("/premium", verifyJWT, activatePremium);


export default router