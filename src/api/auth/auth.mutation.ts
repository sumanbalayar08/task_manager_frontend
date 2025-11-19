import { useMutation } from "@tanstack/react-query";
import apiClient from "../axios";
import { AUTH_ENDPOINTS } from "../../constants/endpoint";
import type { RegisterRequest, RegisterResponse, LoginRequest, LoginResponse } from "../../types/auth.types";
import { queryClient } from "../../providers/client";
import { QUERY_KEYS } from "../../constants/queryKeys";

export const useRegisterMutation = () => {
  return useMutation<RegisterResponse, Error, RegisterRequest>({
    mutationFn: async (data: RegisterRequest) => {
      const res = await apiClient.post(AUTH_ENDPOINTS.REGISTER, data);
      console.log(res);
      return res.data;
    },
  });
};

export const useLoginMutation = () => {
  return useMutation<LoginResponse, Error, LoginRequest>({
    mutationFn: async (data: LoginRequest) => {
      const res = await apiClient.post(AUTH_ENDPOINTS.LOGIN, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ME] });
    },
  });
};

export const useLogoutMutation = () => {
  return useMutation<{ message: string }, Error, void>({
    mutationFn: async () => {
      const res = await apiClient.post(AUTH_ENDPOINTS.LOGOUT);
      return res.data;
    },
    onSuccess: () => {
      queryClient.clear();
    },
  });
};