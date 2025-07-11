export function useChatAI() {
  return useMutation(msg => chatAI(msg));
}
