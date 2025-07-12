import { Box, CircularProgress, Button } from "@mui/material";
import { useInfiniteQuery } from "@tanstack/react-query";
import CommentItem from "./CommentItem";
import useAuth from "../../auth/useAuth";
import axios from "../../api/api";
import { useState } from "react";
import CommentEditor from "./CommentEditor";

const CommentList = ({ videoId }) => {
  const { user } = useAuth();
  const [editing, setEditing] = useState(null);

  const { data, fetchNextPage, hasNextPage, isLoading, refetch } =
    useInfiniteQuery({
      queryKey: ["comments", videoId],
      queryFn: async ({ pageParam = 1 }) => {
        const res = await axios.get(`/comments/${videoId}?page=${pageParam}`);
        return res.data.data;
      },
      getNextPageParam: (_, pages) => pages.length + 1,
    });

  const allComments = data?.pages?.flat() || [];

  const handleEdit = (comment) => setEditing(comment);

  const handleDelete = async (commentId) => {
    await axios.delete(`/comments/c/${commentId}`);
    refetch();
  };

  return (
    <Box mt={4}>
      <CommentEditor
        key={editing?._id || "new"}
        initialValue={editing?.content || ""}
        onSubmit={async (text) => {
          if (editing) {
            await axios.patch(`/comments/c/${editing._id}`, { content: text });
            setEditing(null);
          } else {
            await axios.post(`/comments/${videoId}`, { content: text });
          }
          refetch();
        }}
      />

      {isLoading ? (
        <CircularProgress />
      ) : (
        allComments?.map(
          (c) =>
            c && (
              <CommentItem
                key={c._id}
                comment={c}
                isOwner={c?.owner?._id === user?._id}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            )
        )
      )}

      {hasNextPage && (
        <Box textAlign="center" mt={2}>
          <Button onClick={() => fetchNextPage()}>Load more</Button>
        </Box>
      )}
    </Box>
  );
};

export default CommentList;
