

export type Priority = 'LOW' | 'MEDIUM' | 'HIGH';

export type Task = {
  id: string;
  userId: string;
  title: string;
  description: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  endDate: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateTaskRequest = {
  title: string;
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  endDate: string;
};

export type UpdateTaskRequest = {
  title?: string;
  description?: string;
  priority?: 'LOW' | 'MEDIUM' | 'HIGH';
  endDate?: string;
};

export type TasksResponse = {
  success: boolean;
  message: string;
  data: Task[];
  pagination: {
    total: number;
    page: number;
    perPage: number;
  };
};

export type ApiMessageResponse = {
  message: string;
};