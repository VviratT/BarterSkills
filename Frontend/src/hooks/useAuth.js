import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as authApi from "../api/auth.js";

export default function useAuth() {
  const qc = useQueryClient();

  const { data } = useQuery(["currentUser"], authApi.fetchCurrent, {
    retry: false,
    onError: () => {},
  });

  const loginMut = useMutation(authApi.login, {
    onSuccess: () => qc.invalidateQueries(["currentUser"]),
  });
  const registerMut = useMutation(authApi.register, {
    onSuccess: () => qc.invalidateQueries(["currentUser"]),
  });
  const logoutMut = useMutation(authApi.logout, {
    onSuccess: () => qc.invalidateQueries(["currentUser"]),
  });

  return {
    user: data?.data,            // adapt if ApiResponse wraps differently
    login: loginMut.mutateAsync,
    register: registerMut.mutateAsync,
    logout: logoutMut.mutateAsync,
  };
}
