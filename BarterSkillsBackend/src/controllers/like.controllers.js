import { isValidObjectId } from "mongoose";
import { Like }            from "../models/like.model.js";
import { ApiError }        from "../utils/ApiError.js";
import { ApiResponse }     from "../utils/ApiResponse.js";
import { asyncHandler }    from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const existing = await Like.findOne({ likedBy: req.user._id, video: videoId });
  if (existing) {
    await existing.remove();
    return res.json(new ApiResponse({ message: "Video unliked" }));
  }

  const like = await Like.create({ likedBy: req.user._id, video: videoId });
  res.json(new ApiResponse({
    message: "Video liked",
    data:    like
  }));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!isValidObjectId(commentId)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  const existing = await Like.findOne({ likedBy: req.user._id, comment: commentId });
  if (existing) {
    await existing.remove();
    return res.json(new ApiResponse({ message: "Comment unliked" }));
  }

  const like = await Like.create({ likedBy: req.user._id, comment: commentId });
  res.json(new ApiResponse({
    message: "Comment liked",
    data:    like
  }));
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
