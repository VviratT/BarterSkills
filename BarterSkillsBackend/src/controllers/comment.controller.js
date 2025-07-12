import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!mongoose.isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

  const page = +req.query.page || 1;
  const limit = +req.query.limit || 10;
  const skip = (page - 1) * limit;

  const comments = await Comment.find({ video: videoId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("owner", "fullName avatarUrl");

  res.json(new ApiResponse(200, comments));
});

export const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { content } = req.body;
  if (!mongoose.isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");
  if (!content?.trim()) throw new ApiError(400, "Comment content is required");

  const comment = await Comment.create({
    video: videoId,
    owner: req.user._id,
    content: content.trim(),
  });
  const populated = await comment.populate("owner", "fullName avatarUrl");
  res.status(201).json(new ApiResponse(201, populated, "Comment added"));
});

export const updateComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  const { content } = req.body;
  if (!mongoose.isValidObjectId(commentId)) throw new ApiError(400, "Invalid comment ID");

  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");
  if (!comment.owner.equals(req.user._id)) throw new ApiError(403, "Not authorized");
  if (!content?.trim()) throw new ApiError(400, "Content is required");

  comment.content = content.trim();
  await comment.save();
  res.json(new ApiResponse(200, comment, "Comment updated"));
});

export const deleteComment = asyncHandler(async (req, res) => {
  const { commentId } = req.params;
  if (!mongoose.isValidObjectId(commentId)) throw new ApiError(400, "Invalid comment ID");

  const comment = await Comment.findById(commentId);
  if (!comment) throw new ApiError(404, "Comment not found");
  if (!comment.owner.equals(req.user._id)) throw new ApiError(403, "Not authorized");

  await comment.deleteOne();
  res.json(new ApiResponse(200, null, "Comment deleted"));
});
