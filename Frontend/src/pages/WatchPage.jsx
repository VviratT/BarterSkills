import { useVideo, useWatchVideo } from "../hooks/video";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function WatchPage({ videoId }) {
  const { data: video } = useVideo(videoId);
  const watchMut = useWatchVideo(videoId);
  if (!video) return <div>Loading…</div>;
  return (
    <div>
      <video src={video.videoFile} controls onPlay={() => watchMut.mutate()} />
      <p>Views: {video.views}</p>
      <p>Credits: {video.credits} </p>
    </div>
  );
}
