import { isValidObjectId } from "mongoose";
import { Subscription }    from "../models/subscription.model.js";
import { ApiError }        from "../utils/ApiError.js";
import { ApiResponse }     from "../utils/ApiResponse.js";
import { asyncHandler }    from "../utils/asyncHandler.js";
import mongoose from "mongoose";

const toggleSubscription = asyncHandler(async (req, res) => {
  const { channelId } = req.params;

  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const userId = req.user._id;

  const existing = await Subscription.findOne({
    subscriber: userId,
    channel: channelId
  });

  if (existing) {
    await existing.deleteOne();
    return res
      .status(200)
      .json(new ApiResponse(200, null, "Unsubscribed"));
  }

  const sub = await Subscription.create({
    subscriber: userId,
    channel: channelId
  });

  return res
    .status(200)
    .json(new ApiResponse(200, sub, "Subscribed"));
});



const getUserChannelSubscribers = asyncHandler(async (req, res) => {
  const { channelId } = req.params;
  if (!isValidObjectId(channelId)) {
    throw new ApiError(400, "Invalid channel ID");
  }

  const subs = await Subscription.find({ channel: channelId })
    .populate("subscriber", "fullName username avatar");
  res.json(new ApiResponse(200, subs.map(s => s.subscriber)));

});

const getSubscribedChannels = asyncHandler(async (req, res) => {
  const { subscriberId } = req.params;
  if (!isValidObjectId(subscriberId)) {
    throw new ApiError(400, "Invalid subscriber ID");
  }

  const subs = await Subscription.find({ subscriber: subscriberId })
    .populate("channel", "fullName username avatarUrl");
  res.json(new ApiResponse(200, subs.map(s => s.channel)));
});

export {
  toggleSubscription,
  getUserChannelSubscribers,
  getSubscribedChannels
};
