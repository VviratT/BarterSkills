import { Message } from "../models/message.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import mongoose from "mongoose";


export const sendMessage = asyncHandler(async (req, res) => {
  const { receiverId } = req.params;
  const { text } = req.body;
  if (!text?.trim()) throw new ApiError(400, "Message text required");
  if (!mongoose.isValidObjectId(receiverId)) throw new ApiError(400, "Invalid receiver ID");

  const msg = await Message.create({
    sender: req.user._id,
    receiver: receiverId,
    text: text.trim()
  });

  return res.status(201).json(new ApiResponse(201, msg, "Message sent"));
});


export const getConversation = asyncHandler(async (req, res) => {
  const { otherUserId } = req.params;
  if (!mongoose.isValidObjectId(otherUserId)) throw new ApiError(400, "Invalid user ID");

  const me = req.user._id.toString();
  const them = otherUserId;

  const messages = await Message.find({
    $or: [
      { sender: me,     receiver: them },
      { sender: them,   receiver: me }
    ]
  })
    .sort({ createdAt: 1 }) 
    .populate("sender",   "username fullName avatar")
    .populate("receiver", "username fullName avatar");

  return res.status(200).json(new ApiResponse(200, messages, "Conversation fetched"));
});


export const markAsRead = asyncHandler(async (req, res) => {
  const { otherUserId } = req.params;
  if (!mongoose.isValidObjectId(otherUserId)) throw new ApiError(400, "Invalid user ID");

  await Message.updateMany(
    { sender: otherUserId, receiver: req.user._id, read: false },
    { $set: { read: true } }
  );

  return res.status(200).json(new ApiResponse(200, {}, "Messages marked as read"));
});
