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
  passport.authenticate("google", { failureRedirect: "/auth/google/failure", session: false }),
  async (req, res) => {
    try {
      // 'req.user' is the Mongoose document returned by Passport
      const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(req.user._id);

      // Set cookies
      const cookieOpts = { httpOnly: true, sameSite: "Lax", secure: false };
      res.cookie("accessToken", accessToken, cookieOpts);
      res.cookie("refreshToken", refreshToken, cookieOpts);

      // Send response
      return res.status(200).json({
        success: true,
        message: "Google login successful",
        data: {
          user: {
            _id: req.user._id,
            fullName: req.user.fullName,
            email: req.user.email,
            username: req.user.username,
            avatar: req.user.avatar,
          },
          accessToken,
          refreshToken
        }
      });
    } catch (error) {
      console.error("🚨 Google login callback failed:", error);
      return res.status(500).json({
        success: false,
        message: "Google login failed",
        error: error.message || error
      });
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