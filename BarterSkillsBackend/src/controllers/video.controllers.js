import mongoose              from "mongoose";
import { Video }             from "../models/video.model.js";
import { ApiError }          from "../utils/ApiError.js";
import { ApiResponse }       from "../utils/ApiResponse.js";
import { asyncHandler }      from "../utils/asyncHandler.js";
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js";
import fs from "fs";
import ffmpeg from "fluent-ffmpeg";
import path from "path";
import { runLocalAI } from "../utils/runLocalAI.js";
import { fetchQuestions } from "../utils/hfQG.js";
import { User } from "../models/user.model.js";
import { Like } from "../models/like.model.js";
import { View  } from "../models/view.model.js"; 



export const getSingleVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const { watchIntent } = req.query; 

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId).populate(
    "owner",
    "fullName avatarUrl username"
  );

  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const likeCount = await Like.countDocuments({ video: video._id });
  const isLiked = req.user
    ? Boolean(await Like.exists({ video: video._id, likedBy: req.user._id }))
    : false;

  let remainingCredits = null;
  let shouldIncreaseView = false;

  if (watchIntent === "true") {
    if (req.user) {
      remainingCredits = req.user.credits;

      const firstView = !(await View.exists({
        video: video._id,
        viewer: req.user._id,
      }));

      if (firstView) {
        if (!video.isPremium && req.user.credits > 0) {
          req.user.credits -= 1;
          await req.user.save();
          remainingCredits = req.user.credits;
        }

        await View.create({ video: video._id, viewer: req.user._id });
        shouldIncreaseView = true;
      }
    } else {
      shouldIncreaseView = true;
    }
  }

  if (shouldIncreaseView) {
    video.views = (video.views || 0) + 1;
    await video.save();
  }

  return res.status(200).json({
    success: true,
    message: "Video fetched successfully",
    data: {
      ...video.toObject(),
      likeCount,
      isLiked,
      remainingCredits,
    },
  });
});






 const processVideoAI = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);
  if (!video) throw new ApiError(404, "Video not found");

  // 1) run whisper + summarizer
  const tempPath = `public/temp/${videoId}.mp4`;
  const { transcript, summary } = await runLocalAI(video.videoFile, tempPath);

  // 2) questions
  const rawQs = await fetchQuestions(summary);
  video.transcript = transcript;
  video.summary    = summary;
  video.questions  = rawQs.map(q => ({ question: q }));
  await video.save();

  // 3) return the full updated video under `data`
  return res.status(200).json({
    success: true,
    message: "AI content generated",
    data: video,        // front‑end will re‑fetch and pick up transcript/summary/questions
  });
});



const getVideoAI = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  const video = await Video.findById(videoId);

  if (!video) throw new ApiError(404, "Video not found");

  return res.status(200).json(
  new ApiResponse(
    200,
    { transcript, summary, questions },
    "AI data fetched successfully"
  )
);
});


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
    .populate("owner", "fullName avatarUrl username");

  const video = await Promise.all(
    videos.map(async (vid) => {
      const likeCount = await Like.countDocuments({ video: vid._id });
      return {
        ...vid.toObject(),
        likeCount,
      };
    })
  );

  res.json(new ApiResponse(200, video, "Videos fetched successfully"));
});


/**
 * Get duration of a video file (rounded to 2 decimal places).
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

      const rounded = Number(duration.toFixed(2));
      resolve(rounded);
    });
  });
};


const publishAVideo = asyncHandler(async (req, res) => {
  
  if (!req.user || !req.user._id) {
    throw new ApiError(401, "Unauthorized: missing or invalid token");
  }
  
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

  const newVideo = new Video({
    title: title.trim(),
    description: description.trim(),
    duration,
    videoFile: uploadedVideo.secure_url,
    thumbnail: uploadedThumb.secure_url,
    owner: req.user._id,
    isPremium: duration > 90,
  });
  await newVideo.save();

  await User.findByIdAndUpdate(req.user._id, { $inc: { credits: 5 } });

  return res.status(201).json(
    new ApiResponse(201, newVideo, "Video published")
  );

});


const getVideoById = asyncHandler(async (req, res) => {
  const { videoId } = req.params;
  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId).populate("owner", "fullName avatarUrl");
  if (!video) throw new ApiError(404, "Video not found");

  return res.status(200).json(
    new ApiResponse(200, video, "Video fetched successfully")
  );
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

const watchVideo = asyncHandler(async (req, res) => {
  const { videoId } = req.params;

  if (!mongoose.isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid video ID");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  const now = new Date();
  const user = req.user;
  const isUserPremium = user.isPremium && user.premiumExpiresAt > now;
  if (!isUserPremium && video.isPremium) {
    throw new ApiError(403, "Subscription required to watch this video");
  }

  let creditsBefore = user.credits || 0;
  if (!video.isPremium) {
    if (creditsBefore < 1) {
      throw new ApiError(400, "Not enough credits. Earn or buy more to watch free videos.");
    }
    user.credits = creditsBefore - 1;
    user.watchHistory = user.watchHistory || [];
    user.watchHistory.push(video._id);
    await user.save();
  }

  video.views = (video.views || 0) + 1;
  await video.save();
  
  return res.json(
    new ApiResponse({
      data: {
        videoUrl: video.videoFile,
        remainingCredits: user.credits,
      },
      message: "Enjoy your video!"
    })
  );
});

export {
  getAllVideos,
  publishAVideo,
  getVideoById,
  updateVideo,
  deleteVideo,
  togglePublishStatus,
  watchVideo,
  getVideoAI,
  processVideoAI,
};
