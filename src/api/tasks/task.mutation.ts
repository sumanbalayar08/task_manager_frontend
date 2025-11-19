import { useMutation } from "@tanstack/react-query";
import apiClient from "../axios";
import { TASK_ENDPOINTS } from "../../constants/endpoint";
import type { CreateTaskRequest, UpdateTaskRequest, ApiMessageResponse } from "../../types/tasks.types";
import { queryClient } from "../../providers/client";
import { QUERY_KEYS } from "../../constants/queryKeys";

export const useCreateTaskMutation = () => {
  return useMutation<ApiMessageResponse, Error, CreateTaskRequest>({
    mutationFn: async (data: CreateTaskRequest) => {
      const res = await apiClient.post(TASK_ENDPOINTS.TASKS, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
    },
  });
};

export const useUpdateTaskMutation = () => {
  return useMutation<ApiMessageResponse, Error, { id: string; data: UpdateTaskRequest }>({
    mutationFn: async ({ id, data }) => {
      const res = await apiClient.patch(`${TASK_ENDPOINTS.TASKS}/${id}`, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASK] });
    },
  });
};

export const useDeleteTaskMutation = () => {
  return useMutation<ApiMessageResponse, Error, string>({
    mutationFn: async (id: string) => {
      const res = await apiClient.delete(`${TASK_ENDPOINTS.TASKS}/${id}`);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.TASKS] });
    },
  });
};