import mongoose         from "mongoose";
import { Tweet }        from "../models/tweet.model.js";
import { ApiError }     from "../utils/ApiError.js";
import { ApiResponse }  from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
  const { text } = req.body;
  if (!text || !text.trim()) {
    throw new ApiError(400, "Tweet text is required");
  }

  const tweet = await Tweet.create({
    text: text.trim(),
    user: req.user._id
  });

  res.status(201).json(new ApiResponse({
    statusCode: 201,
    message:    "Tweet created",
    data:       tweet
  }));
});

const getUserTweets = asyncHandler(async (req, res) => {
  const userId = req.query.userId || req.user._id;
  if (!mongoose.isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const tweets = await Tweet.find({ user: userId })
    .sort({ createdAt: -1 });

  res.json(new ApiResponse({ data: tweets }));
});

const updateTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { text }    = req.body;
  if (!mongoose.isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }
  if (!text || !text.trim()) {
    throw new ApiError(400, "Tweet text is required");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }
  if (!tweet.user.equals(req.user._id)) {
    throw new ApiError(403, "Not authorized to update this tweet");
  }

  tweet.text = text.trim();
  await tweet.save();

  res.json(new ApiResponse({ message: "Tweet updated", data: tweet }));
});

const deleteTweet = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  if (!mongoose.isValidObjectId(tweetId)) {
    throw new ApiError(400, "Invalid tweet ID");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) throw new ApiError(404, "Tweet not found");
  if (!tweet.user.equals(req.user._id)) throw new ApiError(403, "Not allowed");

  await tweet.remove();

  res.json(new ApiResponse({ message: "Tweet deleted" }));
});

export {
  createTweet,
  getUserTweets,
  updateTweet,
  deleteTweet
};
