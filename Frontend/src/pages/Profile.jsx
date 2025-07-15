// src/pages/Profile.jsx
import React from "react";
import {
  Container,
  Typography,
  Avatar,
  Button,
  Stack,
  CircularProgress,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getChannelProfile, toggleSubscribe } from "../api/api.js";
import useAuth from "../auth/useAuth.js";

export default function Profile() {
  const { username } = useParams();
  const { user } = useAuth();
  const qc = useQueryClient();

  // 1) Fetch channel data
  const { data, isLoading, error } = useQuery(["channel", username], () =>
    getChannelProfile(username).then((r) => r.data.data)
  );

  // 2) Subscribe/unsubscribe mutation
  const subMut = useMutation(() => toggleSubscribe(data._id), {
    onMutate: async () => {
      await qc.cancelQueries(["channel", username]);
      const previous = qc.getQueryData(["channel", username]);
      // Optimistic update
      qc.setQueryData(["channel", username], (old) => ({
        ...old,
        isSubscribed: !old.isSubscribed,
        subscribersCount: old.isSubscribed
          ? old.subscribersCount - 1
          : old.subscribersCount + 1,
      }));
      return { previous };
    },
    onError: (_err, _vars, context) => {
      qc.setQueryData(["channel", username], context.previous);
    },
    onSettled: () => {
      qc.invalidateQueries(["channel", username]);
    },
  });

  if (isLoading) return <CircularProgress />;
  if (error)
    return <Typography color="error">Failed to load channel.</Typography>;

  const {
    fullName,
    avatar,
    subscribersCount,
    isSubscribed,
    _id: channelId,
  } = data;
  const isMe = user?._id === channelId;

  return (
    <Container sx={{ mt: 4, textAlign: "center" }}>
      <Avatar src={avatar} sx={{ width: 100, height: 100, mx: "auto" }} />
      <Typography variant="h4" mt={2}>
        {fullName}
      </Typography>
      <Typography variant="subtitle1" color="text.secondary">
        {subscribersCount} subscriber{subscribersCount === 1 ? "" : "s"}
      </Typography>

      {!isMe && (
        <Button
          variant={isSubscribed ? "outlined" : "contained"}
          onClick={() => subMut.mutate()}
          sx={{ mt: 2 }}
        >
          {subMut.isLoading ? "…" : isSubscribed ? "Unsubscribe" : "Subscribe"}
        </Button>
      )}
    </Container>
  );
}
