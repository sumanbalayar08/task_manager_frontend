import { z } from "zod";

export const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
  endDate: z.string().min(1, "End date is required"),
});

export const updateTaskSchema = z
  .object({
    title: z.string().min(1, "Title is required").optional(),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    status: z.string().min(1, "Status is required").optional(),
    endDate: z.string().min(1, "End date is required").optional(),
  })

export type CreateTaskFormData = z.infer<typeof createTaskSchema>;
export type UpdateTaskFormData = z.infer<typeof updateTaskSchema>;
