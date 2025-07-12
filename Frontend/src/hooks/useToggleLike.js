import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "../api/api.js";

export function useToggleVideoLike(videoId) {
  const qc = useQueryClient();
  return useMutation(
    () => api.post(`/likes/toggle/v/${videoId}`),
    { onSuccess: () => qc.invalidateQueries(["video", videoId]) }
  );
}
