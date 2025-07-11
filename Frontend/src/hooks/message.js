export function useConversation(otherId) {
  return useQuery(["msgs", otherId], () =>
    fetchConversation(otherId).then(r => r.data.data)
  );
}
export function useSendMessage(otherId) {
  const qc = useQueryClient();
  return useMutation(text => sendMessage(otherId, text), {
    onSuccess: () => qc.invalidateQueries(["msgs", otherId])
  });
}
