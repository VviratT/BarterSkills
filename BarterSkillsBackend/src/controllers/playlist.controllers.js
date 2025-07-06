import { isValidObjectId } from "mongoose";
import { Playlist }        from "../models/playlist.model.js";
import { ApiError }        from "../utils/ApiError.js";
import { ApiResponse }     from "../utils/ApiResponse.js";
import { asyncHandler }    from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;
  if (!name?.trim()) {
    throw new ApiError(400, "Playlist name is required");
  }

  const playlist = await Playlist.create({
    name:        name.trim(),
    description: description?.trim() || "",
    owner:       req.user._id,
    videos:      []
  });

  res.status(201).json(new ApiResponse({
    statusCode: 201,
    message:    "Playlist created",
    data:       playlist
  }));
});

const getUserPlaylists = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  if (!isValidObjectId(userId)) {
    throw new ApiError(400, "Invalid user ID");
  }

  const playlists = await Playlist.find({ owner: userId })
    .populate("videos", "title url")
    .sort({ createdAt: -1 });

  res.json(new ApiResponse({ data: playlists }));
});

const getPlaylistById = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }

  const playlist = await Playlist.findById(playlistId)
    .populate("videos", "title url");
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }

  res.json(new ApiResponse({ data: playlist }));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid IDs");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found");
  }
  if (!playlist.owner.equals(req.user._id)) {
    throw new ApiError(403, "Not allowed to modify this playlist");
  }
  if (playlist.videos.includes(videoId)) {
    throw new ApiError(400, "Video already in playlist");
  }

  playlist.videos.push(videoId);
  await playlist.save();

  res.json(new ApiResponse({
    message: "Video added to playlist",
    data:    playlist
  }));
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
  const { playlistId, videoId } = req.params;
  if (!isValidObjectId(playlistId) || !isValidObjectId(videoId)) {
    throw new ApiError(400, "Invalid IDs");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");
  if (!playlist.owner.equals(req.user._id)) {
    throw new ApiError(403, "Not allowed to modify this playlist");
  }

  playlist.videos = playlist.videos.filter(v => v.toString() !== videoId);
  await playlist.save();

  res.json(new ApiResponse({
    message: "Video removed from playlist",
    data:    playlist
  }));
});

const updatePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  const { name, description } = req.body;
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }

  const updates = {};
  if (name?.trim())        updates.name = name.trim();
  if (description?.trim()) updates.description = description.trim();

  const playlist = await Playlist.findByIdAndUpdate(
    playlistId,
    updates,
    { new: true }
  );
  if (!playlist) throw new ApiError(404, "Playlist not found");

  res.json(new ApiResponse({
    message: "Playlist updated",
    data:    playlist
  }));
});

const deletePlaylist = asyncHandler(async (req, res) => {
  const { playlistId } = req.params;
  if (!isValidObjectId(playlistId)) {
    throw new ApiError(400, "Invalid playlist ID");
  }

  const playlist = await Playlist.findByIdAndDelete(playlistId);
  if (!playlist) throw new ApiError(404, "Playlist not found");

  res.json(new ApiResponse({ message: "Playlist deleted" }));
});

export {
  createPlaylist,
  getUserPlaylists,
  getPlaylistById,
  addVideoToPlaylist,
  removeVideoFromPlaylist,
  updatePlaylist,
  deletePlaylist
};
