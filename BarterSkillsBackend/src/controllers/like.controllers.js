import { isValidObjectId } from "mongoose";
import { Like }            from "../models/like.model.js";
import { ApiError }        from "../utils/ApiError.js";
import { ApiResponse }     from "../utils/ApiResponse.js";
import { asyncHandler }    from "../utils/asyncHandler.js";
import mongoose from "mongoose";
import { Video } from "../models/video.model.js";

 const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");
  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  const existing = await Like.findOne({ video: videoId, likedBy: userId });
  const liked = !existing;
  if (existing) await existing.deleteOne();
  else await Like.create({ video: videoId, likedBy: userId });

  res.json(new ApiResponse(200, { liked }, liked ? "Video liked" : "Like removed"));
});


const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const userId = req.user._id;

  if (!mongoose.isValidObjectId(commentId)) throw new ApiError(400, "Invalid comment ID");
  const existing = await Like.findOne({ comment: commentId, likedBy: userId });
  if (existing) {
    await existing.deleteOne();
    return res.json(new ApiResponse(200, null, "Comment unliked"));
  }
  await Like.create({ comment: commentId, likedBy: userId });
  res.json(new ApiResponse(200, null, "Comment liked"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const existing = await Like.findOne({ likedBy: req.user._id, tweet: tweetId });
  if (existing) {
    await existing.remove();
    return res.json(new ApiResponse({ message: "Tweet unliked" }));
  }

  const like = await Like.create({ likedBy: req.user._id, tweet: tweetId });
  res.json(new ApiResponse({
    message: "Tweet liked",
    data:    like
  }));
});

const getLikedVideos = asyncHandler(async (req, res) => {
  const likes = await Like.find({ likedBy: req.user._id, video: { $exists: true } })
    .populate("video", "title thumbnail owner");
  const videos = likes.map(l => l.video);
  res.json(new ApiResponse({ data: videos }));
});

export {
  toggleVideoLike,
  toggleCommentLike,
  toggleTweetLike,
  getLikedVideos
};
