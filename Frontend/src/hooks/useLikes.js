import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import * as commentApi from "../api/comment";
import * as likeApi from "../api/like";

export function useComments(videoId, page) {
  return useQuery(["comments", videoId, page], () =>
    commentApi.fetchComments(videoId, { page }).then(r => r.data.data)
  );
}
export function usePostComment(videoId) {
  const qc = useQueryClient();
  return useMutation(content => commentApi.postComment(videoId, content), {
    onSuccess: () => qc.invalidateQueries(["comments", videoId])
  });
}

export function useToggleLike(videoId) {
  const qc = useQueryClient();
  return useMutation(() => likeApi.toggleLikeVideo(videoId), {
    onSuccess: () => qc.invalidateQueries(["video", videoId])
  });
}
