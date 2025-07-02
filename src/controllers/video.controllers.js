import mongoose              from "mongoose";
import { Video }             from "../models/video.model.js";
import { ApiError }          from "../utils/ApiError.js";
import { ApiResponse }       from "../utils/ApiResponse.js";
import { asyncHandler }      from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import path from "path";

const getAllVideos = asyncHandler(async (req, res) => {
  let { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query;
  page  = parseInt(page,  10);
  limit = parseInt(limit, 10);
  const skip = (page - 1) * limit;

  const filter = {};
  if (query) {
    const regex = new RegExp(query, "i");
    filter.$or = [{ title: regex }, { description: regex }, { tags: regex }];
  }
  if (userId) {
    if (!mongoose.isValidObjectId(userId)) {
      throw new ApiError(400, "Invalid user ID filter");
    }
    filter.owner = userId;
  }

  const sortField = sortBy || "createdAt";
  const sortOrder = sortType === "asc" ? 1 : -1;

  const videos = await Video.find(filter)
    .sort({ [sortField]: sortOrder })
    .skip(skip)
    .limit(limit)
    .populate("owner", "fullName avatarUrl");

  res.json(new ApiResponse({ data: videos }));
});

/**
 * Get duration of a video file.
 * @param {string} absPath - absolute path from multer (videoFile.path)
 * @returns {Promise<number>}
 */
const getVideoDuration = (absPath) => {
  return new Promise((resolve, reject) => {
    console.log("→ Checking duration at:", absPath, "exists?", fs.existsSync(absPath));
    if (!fs.existsSync(absPath)) {
      return reject(new Error(`Video file not found at ${absPath}`));
    }
    ffmpeg.ffprobe(absPath, (err, metadata) => {
      if (err) return reject(err);
      const duration = metadata?.format?.duration;
      if (!duration) return reject(new Error("No duration in metadata"));
      resolve(duration);
    });
  });
};

const publishAVideo = asyncHandler(async (req, res) => {
  const { title = "", description = "" } = req.body;

  if (!title.trim()) {
    throw new ApiError(400, "Video title is required");
  }

  const videoFile = req.files?.videoFile?.[0];
  const thumbFile = req.files?.thumbnail?.[0];
  if (!videoFile || !thumbFile) {
    throw new ApiError(400, "Both videoFile and thumbnail are required");
  }

  const videoPath = videoFile.path;
  const thumbPath = thumbFile.path;
  console.log("Publishing video from:", videoPath);

  const duration = await getVideoDuration(videoPath);
  if (duration <= 0) {
    throw new ApiError(400, "Invalid video duration");
  }

  const now = new Date();
  const isPremium = req.user.isPremium && req.user.premiumExpiresAt > now;
  const maxFree = 90;
  const maxPremium = 180;
  const maxDuration = isPremium ? maxPremium : maxFree;
  if (duration > maxDuration) {
    throw new ApiError(
      400,
      `Video too long (${Math.round(duration)}s). Free users: ≤${maxFree}s, Premium: ≤${maxPremium}s.`
    );
  }

  const uploadedVideo = await uploadOnCloudinary(videoPath, "videos");
  if (!uploadedVideo?.secure_url) {
    throw new ApiError(500, "Cloudinary video upload failed");
  }

  const uploadedThumb = await uploadOnCloudinary(thumbPath, "thumbnails");
  if (!uploadedThumb?.secure_url) {
    if (uploadedVideo.public_id) {
      await deleteFromCloudinary(uploadedVideo.public_id);
    }
    throw new ApiError(500, "Cloudinary thumbnail upload failed");
  }

  fs.unlink(videoPath, () => {});
  fs.unlink(thumbPath, () => {});

  const video = await Video.create({
    title: title.trim(),
    description: description.trim(),
    duration,
    videoFile: uploadedVideo.secure_url,
    thumbnail: uploadedThumb.secure_url,
    owner: req.user._id,
    isPremium,
  });

  return res.status(201).json(
    new ApiResponse({
      statusCode: 201,
      message: "Video published",
      data: video,
    })
  );
});


const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId).populate("owner", "fullName avatarUrl");
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  res.json(new ApiResponse({ data: video }));
});

const updateVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { title, description, tags } = req.body;
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");
  if (!video.owner.equals(req.user._id)) throw new ApiError(403, "Not allowed");

  if (title?.trim())       video.title       = title.trim();
  if (description?.trim()) video.description = description.trim();
  if (tags) {
    video.tags = tags.split(",").map(t => t.trim()).filter(Boolean);
  }

  if (req.file?.path) {
    await uploadOnCloudinary.destroy(video.publicId);
    const uploadRes = await uploadOnCloudinary(req.file.path, "videos");
    video.url      = uploadRes.secure_url;
    video.publicId = uploadRes.public_id;
  }

  await video.save();
  res.json(new ApiResponse({
    message: "Video updated",
    data:    video
  }));
});

const deleteVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");
  if (!video.owner.equals(req.user._id)) throw new ApiError(403, "Not allowed");

  if (video.publicId) {
    await deleteFromCloudinary(video.publicId);
  }

  await video.deleteOne();

  res.json(new ApiResponse({ message: "Video deleted" }));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");
  if (!video.owner.equals(req.user._id)) throw new ApiError(403, "Not allowed");

  video.isPublished = !video.isPublished;
  await video.save();

  res.json(new ApiResponse({
    message: `Video ${video.isPublished ? "published" : "unpublished"}`,
    data:    video
  }));
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus
};
