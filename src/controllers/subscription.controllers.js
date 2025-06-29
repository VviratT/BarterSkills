import { isValidObjectId } from "mongoose";
import { Subscription }    from "../models/subscription.model.js";
import { ApiError }        from "../utils/ApiError.js";
import { ApiResponse }     from "../utils/ApiResponse.js";
import { asyncHandler }    from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const existing = await Subscription.findOne({
    user:    req.user._id,
    channel: channelId
  });
  if (existing) {
    await existing.remove();
    return res.json(new ApiResponse({ message: "Unsubscribed" }));
  }

  const sub = await Subscription.create({
    user:    req.user._id,
    channel: channelId
  });
  res.json(new ApiResponse({
    message: "Subscribed",
    data:    sub
  }));
});

const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const subs = await Subscription.find({ channel: channelId })
    .populate("user", "fullName avatarUrl");
  res.json(new ApiResponse({ data: subs.map(s => s.user) }));
});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID");
  }

  const subs = await Subscription.find({ user: subscriberId })
    .populate("channel", "fullName username avatarUrl");
  res.json(new ApiResponse({ data: subs.map(s => s.channel) }));
});

export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels
};
