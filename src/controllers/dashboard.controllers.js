import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const totalSubscribers = await Subscription.countDocuments({ channel: channelId });

  const totalVideos = await Video.countDocuments({ owner: channelId });

  const videoIds = (await Video.find({ owner: channelId }, { _id: 1 }))
                     .map(v => v._id);
  const totalLikes = await Like.countDocuments({ video: { $in: videoIds } });
  
  const viewsAgg = await User.aggregate([
    { $unwind: "$watchHistory" },
    { $match: { "watchHistory.video": { $in: videoIds } } },
    { $count: "totalViews" }
  ]);
  const totalViews = viewsAgg[0]?.totalViews || 0;

  res.json(new ApiResponse({
    data: { totalSubscribers, totalVideos, totalLikes, totalViews }
  }));
});

const getChannelVideos = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!mongoose.isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const videos = await Video.find({ owner: channelId })
    .sort({ createdAt: -1 })
    .populate("owner", "fullName avatarUrl");

  res.json(new ApiResponse({ data: videos }));
});

export {
  getChannelStats,
  getChannelVideos
};
