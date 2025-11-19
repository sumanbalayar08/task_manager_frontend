import { useQuery } from "@tanstack/react-query";
import apiClient from "../axios";
import { QUERY_KEYS } from "../../constants/queryKeys";
import { TASK_ENDPOINTS } from "../../constants/endpoint";
import type { TasksResponse, Task, Priority } from "../../types/tasks.types";

export const useGetTasks = (page: number, perPage: number, searchTerm?: string, priority?: Priority, sortId: string = "createdAt", desc: boolean = false) => {
  return useQuery<TasksResponse>({
    queryKey: [QUERY_KEYS.TASKS, page, perPage, searchTerm, priority, sortId, desc],
    queryFn: async () => {
      const params = new URLSearchParams({
        page: page.toString(),
        perPage: perPage.toString(),
      });

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (priority) {
        params.append('priority', priority);
      }

      if (sortId) {
        params.append('sortId', sortId);
      }

      if (desc) {
        params.append('desc', desc.toString());
      }

      const res = await apiClient.get(`${TASK_ENDPOINTS.TASKS}?${params.toString()}`);
      return res.data;
    },
  });
};

export const useGetTask = (id: string) => {
  return useQuery<Task>({
    queryKey: [QUERY_KEYS.TASK, id],
    queryFn: async () => {
      const res = await apiClient.get(`${TASK_ENDPOINTS.TASKS}/${id}`);
      return res.data;
    },
    enabled: !!id,
  });
};