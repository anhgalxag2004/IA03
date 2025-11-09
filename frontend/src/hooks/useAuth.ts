import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authApi } from "../services/api";
import type { LoginRequest } from "../types/api";

export const useLogin = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: LoginRequest) => authApi.login(data),
    onSuccess: () => {
      // Invalidate and refetch user profile
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useLogout = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => authApi.logout(),
    onSuccess: () => {
      // Clear all cached data
      queryClient.clear();
    },
  });
};

export const useUserProfile = () => {
  return useQuery({
    queryKey: ["user", "profile"],
    queryFn: () => authApi.getProfile(),
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
