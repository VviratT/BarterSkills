import mongoose from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const page  = parseInt(req.query.page,  10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip  = (page - 1) * limit;

  const comments = await Comment.find({ video: videoId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .populate("user", "fullName avatarUrl");

  res.json(new ApiResponse({ data: comments }));
});

const addComment = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { text }    = req.body;

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }
  if (!text || !text.trim()) {
    throw new ApiError(400, "Comment text is required");
  }

  const comment = await Comment.create({
    video: videoId,
    user:  req.user._id,
    text:  text.trim()
  });

  const populated = await comment.populate("user", "fullName avatarUrl");

  res
    .status(201)
    .json(new ApiResponse({
      statusCode: 201,
      message:    "Comment added",
      data:       populated
    }));
});

const updateComment = asyncHandler(async (req, res) => {
  const { id }   = req.params;
  const { text } = req.body;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid comment ID");
  }
  if (!text || !text.trim()) {
    throw new ApiError(400, "Comment text is required");
  }

  const comment = await Comment.findById(id);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  if (!comment.user.equals(req.user._id)) {
    throw new ApiError(403, "Not authorized to update this comment");
  }

  comment.text = text.trim();
  await comment.save();

  res.json(new ApiResponse({
    message: "Comment updated",
    data:    comment
  }));
});

const deleteComment = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    throw new ApiError(400, "Invalid comment ID");
  }

  const comment = await Comment.findById(id);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }
  if (!comment.user.equals(req.user._id)) {
    throw new ApiError(403, "Not authorized to delete this comment");
  }

  await comment.remove();

  res.json(new ApiResponse({ message: "Comment deleted" }));
});

export {
  getVideoComments,
  addComment,
  updateComment,
  deleteComment
};
