import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js"; 
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getDashboardStats = asyncHandler(async (req, res) => {
  const creatorId = req.user._id;

  const totalVideos = await Video.countDocuments({ owner: creatorId });
  const totalViews = await Video.aggregate([
    { $match: { owner: creatorId } },
    { $group: { _id: null, total: { $sum: "$views" } } },
  ]);
  const subscribersCount = await Subscription.countDocuments({
    subscribedTo: creatorId,
  });

  res.json(
    new ApiResponse(200, {
      totalVideos,
      totalViews: totalViews[0]?.total || 0,
      subscribersCount,
    })
  );
});

export const getDashboardVideos = asyncHandler(async (req, res) => {
  const creatorId = req.user._id;

  const videos = await Video.find({ owner: creatorId })
    .sort({ createdAt: -1 })
    .limit(10);

  res.json(new ApiResponse(200, videos));
});
