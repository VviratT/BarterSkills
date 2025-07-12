import React, { useState } from "react";
import { Box, CircularProgress, Button } from "@mui/material";
import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import CommentItem from "./CommentItem";
import CommentEditor from "./CommentEditor";
import useAuth from "../../auth/useAuth.js";
import api from "../../api/api.js";

export default function CommentList({ videoId }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [editing, setEditing] = useState(null);

  // fetch pages of comments
  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ["comments", videoId],
    queryFn: ({ pageParam = 1 }) =>
      api
        .get(`/comments/${videoId}?page=${pageParam}`)
        .then((r) => r.data.data),
    getNextPageParam: (_last, pages) => pages.length + 1,
  });

  const allComments = data?.pages?.flat() || [];

  // create/update comment
  const saveComment = useMutation({
    mutationFn: ({ id, content }) =>
      id
        ? api.patch(`/comments/c/${id}`, { content })
        : api.post(`/comments/${videoId}`, { content }),
    onSuccess: () => {
      qc.invalidateQueries(["comments", videoId]);
      setEditing(null);
    },
  });

  // delete comment
  const deleteComment = async (commentId) => {
    await api.delete(`/comments/c/${commentId}`);
    qc.invalidateQueries(["comments", videoId]);
  };

  if (isLoading) {
    return <CircularProgress />;
  }

  return (
    <Box mt={2}>
      <CommentEditor
        key={editing?._id || "new"}
        initialValue={editing?.content || ""}
        loading={saveComment.isLoading}
        onSubmit={(text) => {
          saveComment.mutate({ id: editing?._id, content: text });
        }}
      />

      {allComments.map((c) => (
        <CommentItem
          key={c._id}
          comment={c}
          isOwner={c.owner._id === user._id}
          onEdit={() => setEditing(c)}
          onDelete={() => deleteComment(c._id)}
        />
      ))}

      {hasNextPage && (
        <Box textAlign="center" mt={2}>
          <Button onClick={() => fetchNextPage()}>Load more</Button>
        </Box>
      )}
    </Box>
  );
}
