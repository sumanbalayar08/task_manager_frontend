import { useQuery } from "@tanstack/react-query";
import apiClient from "../axios";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { AUTH_ENDPOINTS } from "../../constants/endpoint";
import type { AuthResponse } from "../../types/auth.types";

export const useMe = () => {
  return useQuery<AuthResponse>({
    queryKey: [QUERY_KEYS.ME],
    queryFn: async () => {
      const res = await apiClient.get(AUTH_ENDPOINTS.ME);
      return res.data;
    },
    retry: false,
  });
};
