import React from "react";
import { Button, Skeleton } from "@mui/material";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toggleSubscribe, getChannelProfile } from "../api/api.js";

export default function SubscribeButton({ username }) {
  const qc = useQueryClient();

  // 1) Load the channel’s subscription info
  const {
    data: channel,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["channel", username],
    queryFn: () => getChannelProfile(username).then((r) => r.data.data),
    enabled: Boolean(username),
  });


  // 2) Mutation to toggle
  const subMut = useMutation({
    mutationFn: () => toggleSubscribe(channel._id),
    onSuccess: () => {
      // re‑fetch channel
      qc.invalidateQueries(["channel", username]);
    },
  });

  if (isLoading) return <Skeleton width={100} height={36} />;
  if (error || !channel) return null;

  const { isSubscribed, subscribersCount } = channel;

  return (
    <Button
      size="small"
      variant={isSubscribed ? "outlined" : "contained"}
      onClick={() => subMut.mutate()}
      disabled={subMut.isLoading}
      sx={{ ml: 1 }}
    >
      {subMut.isLoading
        ? "…"
        : isSubscribed
        ? `Unsubscribe (${subscribersCount})`
        : `Subscribe (${subscribersCount})`}
    </Button>
  );
}