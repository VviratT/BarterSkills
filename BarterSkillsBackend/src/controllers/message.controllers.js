import { Conversation } from "../models/conversation.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ChatMessage } from "../models/chatMessage.model.js";

export const getConversations = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const convos = await Conversation.find({
    participants: userId
  })
  .select("participants messages")
  .populate("participants", "fullName avatar")
  .lean();

  const data = convos.map(c => {
    const last = c.messages[c.messages.length - 1] || {};
    const unread = c.messages.filter(m => !m.read && !m.sender.equals(userId)).length;
    return {
      _id: c._id,
      participants: c.participants,
      lastMessage: { text: last.text, createdAt: last.createdAt, sender: last.sender },
      unreadCount: unread
    };
  });
  res.json(new ApiResponse(200, data, "Conversations fetched"));
});

export const getConversation = asyncHandler(async (req, res) => {
  const { convId } = req.params;
  const convo = await Conversation.findById(convId)
    .populate("messages.sender", "fullName avatar")
    .lean();
  if (!convo) throw new ApiError(404, "Conversation not found");

  convo.messages.forEach(m => {
    if (!m.read && !m.sender._id.equals(req.user._id)) m.read = true;
  });
  await Conversation.updateOne({ _id: convId }, { $set: { messages: convo.messages } });

  res.json(new ApiResponse(200, convo.messages, "Messages fetched"));
});

export const createConversation = asyncHandler(async (req, res) => {
  const { otherUserId } = req.body;
  const me = req.user._id.toString();

  const participants = [me, otherUserId].sort();
  let convo = await Conversation.findOne({ participants });
  if (!convo) {
    convo = await Conversation.create({ participants });
  }
  res.json(new ApiResponse(200, { convoId: convo._id }, "Conversation ready"));
});

export const postMessage = asyncHandler(async (req, res) => {
  const { convId } = req.params;
  const { text } = req.body;
  if (!text?.trim()) throw new ApiError(400, "Message text is required");

  const update = {
    $push: { messages: { sender: req.user._id, text } }
  };
  const convo = await Conversation.findByIdAndUpdate(convId, update, { new: true })
    .populate("messages.sender", "fullName avatar")
    .lean();
  if (!convo) throw new ApiError(404, "Conversation not found");

  const msg = convo.messages[convo.messages.length - 1];
  res.json(new ApiResponse(200, msg, "Message sent"));
});

export const getGlobalHistory = async (req, res) => {
  const msgs = await ChatMessage.find()
    .sort({ createdAt: 1 })
    .populate("sender", "fullName username avatar")
    .lean();

  const data = msgs.map(m => ({
    user: {
      _id:        m.sender._id,
      username:   m.sender.username,
      fullName:   m.sender.fullName,
      avatar:     m.sender.avatar,
    },
    text:      m.text,
    createdAt: m.createdAt,
  }));

  return res.json({
    statusCode: 200,
    success:    true,
    message:    "Global history fetched",
    data
  });
};