import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as videoApi from "../api/videos.js";

export function useUploadVideo() {
  const qc = useQueryClient();
  return useMutation(videoApi.uploadVideo, {
    onSuccess: () => qc.invalidateQueries(["videos"])
  });
}

export function useVideo(videoId) {
  return useQuery(["video", videoId], () =>
    videoApi.getVideo(videoId).then(r => r.data.data)
  );
}

export function useWatchVideo(videoId) {
  const qc = useQueryClient();
  return useMutation(() => videoApi.watchVideo(videoId), {
    onSuccess: () => {
      qc.invalidateQueries(["video", videoId]);
      qc.invalidateQueries(["user"]);
    }
  });
}

export function useVideos(params) {
  return useQuery(["videos", params], () =>
    videoApi.listVideos(params).then(r => r.data.data)
  );
}
