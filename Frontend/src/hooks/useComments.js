import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "../utils/axios";

export const useComments = (videoId) => {
  const queryClient = useQueryClient();

  const fetchComments = async ({ pageParam = 1 }) => {
    const res = await axios.get(`/comments/${videoId}?page=${pageParam}`);
    return res.data.data;
  };

  const addComment = useMutation({
    mutationFn: (content) =>
      axios.post(`/comments/${videoId}`, { content }),
    onSuccess: () => queryClient.invalidateQueries(["comments", videoId])
  });

  const updateComment = useMutation({
    mutationFn: ({ commentId, content }) =>
      axios.patch(`/comments/c/${commentId}`, { content }),
    onSuccess: () => queryClient.invalidateQueries(["comments", videoId])
  });

  const deleteComment = useMutation({
    mutationFn: (commentId) =>
      axios.delete(`/comments/c/${commentId}`),
    onSuccess: () => queryClient.invalidateQueries(["comments", videoId])
  });

  return { fetchComments, addComment, updateComment, deleteComment };
};
