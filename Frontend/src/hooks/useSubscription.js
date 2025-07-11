import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getProfile, toggleSubscribe } from "../api/users";

export function useProfile(username) {
  return useQuery(["profile", username], () =>
    getProfile(username).then(res => res.data.data)
  );
}

export function useToggleSub(channelId) {
  const qc = useQueryClient();
  return useMutation(() => toggleSubscribe(channelId), {
    onSuccess: () => qc.invalidateQueries(["profile", channelId])
  });
}
