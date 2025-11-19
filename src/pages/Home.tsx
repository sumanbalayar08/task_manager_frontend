"use client";

import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";
import { Badge } from "../components/ui/badge";
import { useGetTasks } from "../api/tasks/task.query";
import { useDeleteTaskMutation, useUpdateTaskMutation, useCreateTaskMutation } from "../api/tasks/task.mutation";
import type { Task, Priority } from "../types/tasks.types";
import usePagination from "../hooks/use-pagination";
import Action from "../components/table/action";
import Table from "../components/table";
import Hero from "../components/hero/page";
import DeleteModal from "../components/modal/delete-modal";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateTaskSchema, type UpdateTaskFormData, createTaskSchema, type CreateTaskFormData } from "../validation_schemas/tasks.schema";
import Modal from "../components/ui/modal";

export default function TasksPage() {
  const [pagination, setPagination] = usePagination();
  const [viewTask, setViewTask] = useState<Task | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [sortId, setSortId] = useState<string | null>(null);
  const [desc, setDesc] = useState<boolean | null>(null);
  const [priority, setPriority] = useState<Priority | null>(null);

  const { register, handleSubmit, formState: { errors, isSubmitting }, reset, setValue } = useForm<UpdateTaskFormData>({
    resolver: zodResolver(updateTaskSchema),
  });

  const { register: registerCreate, handleSubmit: handleCreateSubmit, formState: { errors: createErrors, isSubmitting: isCreating }, reset: resetCreate, setValue: setCreateValue, watch } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
  });


  const { data, isLoading } = useGetTasks(
    pagination.currentPage,
    pagination.perPage,
    pagination.searchTerm,
    priority as Priority,
    sortId as string,
    desc as boolean,
  );

  console.log(data);

  const deleteTask = useDeleteTaskMutation();
  const updateTask = useUpdateTaskMutation();
  const createTask = useCreateTaskMutation();

  const isTaskOverdue = (endDate: string) => {
    const today = new Date();
    const taskDate = new Date(endDate);
    return taskDate < today;
  };

  const columns: ColumnDef<Task>[] = [
    {
      accessorKey: "title",
      header: "Task Title",
      size: 300,
      cell: ({ row }) => {
        const overdue = isTaskOverdue(row.original.endDate);
        return (
          <div className={`text-sm font-medium ${overdue ? 'text-red-600 font-semibold' : ''}`}>
            {row.original.title}
            {overdue && (
              <span className="ml-2 text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">
                Overdue
              </span>
            )}
          </div>
        );
      },
    },
    {
      accessorKey: "priority",
      header: "Priority",
      size: 100,
      cell: ({ row }) => (
        <Badge
          variant={
            row.original.priority === "HIGH"
              ? "destructive"
              : row.original.priority === "MEDIUM"
                ? "secondary"
                : "outline"
          }
          className="capitalize font-medium"
        >
          {row.original.priority.toLowerCase()}
        </Badge>
      ),
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      size: 150,
      cell: ({ row }) => {
        const overdue = isTaskOverdue(row.original.endDate);
        return (
          <div className={`text-sm font-medium ${overdue ? 'text-red-600' : 'text-gray-700'}`}>
            {new Date(row.original.endDate).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric'
            })}
          </div>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      size: 200,
      cell: ({ row }) => (
        <div className="text-sm text-gray-700">
          {new Date(row.original.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </div>
      ),
    },
    {
      accessorKey: "actions",
      header: () => <div className="text-center">Actions</div>,
      size: 200,
      cell: ({ row }) => (
        <div className="flex justify-center gap-2">
          <Action
            onShow={() => setViewTask(row.original)}
            onEdit={() => handleEditClick(row.original)}
            onDelete={() => {
              setTaskToDelete(row.original.id);
              setDeleteModalOpen(true);
            }}
          />
        </div>
      ),
    },
  ];

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      deleteTask.mutate(taskToDelete);
      setDeleteModalOpen(false);
      setTaskToDelete(null);
    }
  };

  const handleEditClick = (task: Task) => {
    setTaskToEdit(task);
    reset({
      title: task.title,
      description: task.description,
      priority: task.priority,
      endDate: task.endDate.split('T')[0],
    });
    setEditModalOpen(true);
  };

  const handleEditSubmit = (formData: UpdateTaskFormData) => {
    if (taskToEdit) {
      updateTask.mutate({
        id: taskToEdit.id,
        data: formData
      }, {
        onSuccess: () => {
          setEditModalOpen(false);
          setTaskToEdit(null);
          reset();
        }
      });
    }
  };

  const handleCreateFormSubmit = (formData: CreateTaskFormData) => {
    createTask.mutate(formData, {
      onSuccess: () => {
        setCreateModalOpen(false);
        resetCreate();
      }
    });
  };

  return (
    <>
      <Hero
        title="Task Manager"
        subtitle="Manage all your tasks, track their progress, and organize your work."
        badge="Tasks"
      />
      <section className="p-6 md:p-8 bg-white">
        <div className="mb-6 flex items-center justify-end flex-wrap gap-4">
          <div className="flex items-center gap-4">

            <Select
              value={priority ?? "all"}
              onValueChange={(value) =>
                value === "all" ? setPriority(null) : setPriority(value as Priority)
              }
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All priorities" />
              </SelectTrigger>

              <SelectContent className="bg-white">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="LOW">Low</SelectItem>
                <SelectItem value="MEDIUM">Medium</SelectItem>
                <SelectItem value="HIGH">High</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={desc === null ? "none" : desc ? "desc" : "asc"}
              onValueChange={(value) => {
                if (value === "none") {
                  setDesc(null);
                  setSortId(null);
                  return;
                }
                setSortId("createdAt");
                setDesc(value === "desc");
              }}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>

              <SelectContent className="bg-white">
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
                <SelectItem value="asc">Ascending</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => {
                setPriority(null);
                setSortId(null);
                setDesc(null);
              }}
            >
              Clear
            </Button>

          </div>

          <Button
            onClick={() => setCreateModalOpen(true)}
            className="px-6 bg-purple-600 hover:bg-purple-700 text-white"
          >
            Create Task
          </Button>
        </div>

        <Table
          columns={columns}
          data={data?.data || []}
          loading={isLoading}
          pagination={pagination}
          setPagination={setPagination}
          showSearch={true}
        />

        {viewTask && (
          <Modal
            open={!!viewTask}
            setOpen={() => setViewTask(null)}
            title="Task Details"
            size="md"
          >
            <div className="space-y-4 mt-4">
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Task ID</Label>
                  <p className="text-sm text-gray-900 mt-1 font-mono">{viewTask.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Title</Label>
                  <p className="text-sm text-gray-900 mt-1">{viewTask.title}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Description</Label>
                  <p className="text-sm text-gray-900 mt-1 whitespace-pre-wrap">{viewTask.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Priority</Label>
                    <div className="mt-1">
                      <Badge
                        variant={
                          viewTask.priority === "HIGH"
                            ? "destructive"
                            : viewTask.priority === "MEDIUM"
                              ? "secondary"
                              : "outline"
                        }
                        className="capitalize"
                      >
                        {viewTask.priority.toLowerCase()}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">End Date</Label>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(viewTask.endDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Created At</Label>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(viewTask.createdAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Updated At</Label>
                    <p className="text-sm text-gray-900 mt-1">
                      {new Date(viewTask.updatedAt).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={() => setViewTask(null)}
                className="px-6"
              >
                Close
              </Button>
            </div>
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        {taskToDelete && (
          <DeleteModal
            open={deleteModalOpen}
            setOpen={setDeleteModalOpen}
            onDelete={handleDeleteConfirm}
            loading={deleteTask.isPending}
            title="Delete Task"
            description="Are you sure you want to delete this task? This action cannot be undone."
            buttonLabel="Delete Task"
            loadingButtonLabel="Deleting..."
          />
        )}

        {/* Edit Task Modal */}
        {taskToEdit && (
          <Modal
            open={editModalOpen}
            setOpen={() => {
              setEditModalOpen(false);
              setTaskToEdit(null);
              reset();
            }}
            title="Edit Task"
            size="md"
          >
            <form onSubmit={handleSubmit(handleEditSubmit)} noValidate className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="edit-title" className="text-sm font-medium text-gray-700">
                  Title *
                </Label>
                <Input
                  id="edit-title"
                  className="h-11 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="Enter task title"
                  {...register("title")}
                />
                {errors.title && (
                  <p className="text-sm text-red-600 mt-1 font-medium">{errors.title.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-sm font-medium text-gray-700">
                  Description *
                </Label>
                <Input
                  id="edit-description"
                  className="h-11 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  placeholder="Enter task description"
                  {...register("description")}
                />
                {errors.description && (
                  <p className="text-sm text-red-600 mt-1 font-medium">{errors.description.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-priority" className="text-sm font-medium text-gray-700">
                  Priority *
                </Label>
                <Select
                  defaultValue={taskToEdit.priority}
                  onValueChange={(value: "LOW" | "MEDIUM" | "HIGH") => {
                    setValue("priority", value);
                  }}
                >
                  <SelectTrigger className="h-11 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors">
                    <SelectValue placeholder="Select priority" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="LOW">Low</SelectItem>
                    <SelectItem value="MEDIUM">Medium</SelectItem>
                    <SelectItem value="HIGH">High</SelectItem>
                  </SelectContent>
                </Select>
                {errors.priority && (
                  <p className="text-sm text-red-600 mt-1 font-medium">{errors.priority.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-endDate" className="text-sm font-medium text-gray-700">
                  End Date *
                </Label>
                <Input
                  id="edit-endDate"
                  type="date"
                  className="h-11 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                  {...register("endDate")}
                />
                {errors.endDate && (
                  <p className="text-sm text-red-600 mt-1 font-medium">{errors.endDate.message}</p>
                )}
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setEditModalOpen(false);
                    setTaskToEdit(null);
                    reset();
                  }}
                  className="px-6"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting || updateTask.isPending}
                  className="px-6"
                >
                  {isSubmitting || updateTask.isPending ? "Updating..." : "Update Task"}
                </Button>
              </div>
            </form>
          </Modal>
        )}

        {/* Create Task Modal */}
        <Modal
          open={createModalOpen}
          setOpen={() => {
            setCreateModalOpen(false);
            resetCreate();
          }}
          title="Create Task"
          size="md"
        >
          <form onSubmit={handleCreateSubmit(handleCreateFormSubmit)} noValidate className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="create-title" className="text-sm font-medium text-gray-700">
                Title *
              </Label>
              <Input
                id="create-title"
                className="h-11 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="Enter task title"
                {...registerCreate("title")}
              />
              {createErrors.title && (
                <p className="text-sm text-red-600 mt-1 font-medium">{createErrors.title.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-description" className="text-sm font-medium text-gray-700">
                Description
              </Label>
              <Input
                id="create-description"
                className="h-11 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                placeholder="Enter task description"
                {...registerCreate("description")}
              />
              {createErrors.description && (
                <p className="text-sm text-red-600 mt-1 font-medium">{createErrors.description.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-priority" className="text-sm font-medium text-gray-700">
                Priority *
              </Label>
              <Select
                value={watch("priority")}
                onValueChange={(value: "LOW" | "MEDIUM" | "HIGH") => {
                  setCreateValue("priority", value);
                }}
              >
                <SelectTrigger className="h-11 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                </SelectContent>
              </Select>
              {createErrors.priority && (
                <p className="text-sm text-red-600 mt-1 font-medium">{createErrors.priority.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="create-endDate" className="text-sm font-medium text-gray-700">
                End Date *
              </Label>
              <Input
                id="create-endDate"
                type="date"
                className="h-11 px-4 border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-colors"
                {...registerCreate("endDate")}
              />
              {createErrors.endDate && (
                <p className="text-sm text-red-600 mt-1 font-medium">{createErrors.endDate.message}</p>
              )}
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setCreateModalOpen(false);
                  resetCreate();
                }}
                className="px-6"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isCreating || createTask.isPending}
                className="px-6"
              >
                {isCreating || createTask.isPending ? "Creating..." : "Create Task"}
              </Button>
            </div>
          </form>
        </Modal>
      </section >
    </>
  );
}