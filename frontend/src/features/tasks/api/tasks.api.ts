import { api } from "../../../shared/lib/axios";
import type { CreateTaskPayload, Task, UpdateTaskPayload } from "../types";

export const tasksApi = {
  async getTasks(): Promise<Task[]> {
    const response = await api.get("/tasks");
    return response.data;
  },

  async getTaskById(taskId: string): Promise<Task> {
    const response = await api.get(`/tasks/${taskId}`);
    return response.data;
  },

  async createTask(payload: CreateTaskPayload): Promise<Task> {
    const response = await api.post("/tasks", payload);
    return response.data;
  },

  async updateTask(taskId: string, payload: UpdateTaskPayload): Promise<Task> {
    const response = await api.patch(`/tasks/${taskId}`, payload);
    return response.data;
  },

  async deleteTask(taskId: string): Promise<string> {
    await api.delete(`/tasks/${taskId}`);
    return taskId;
  },
};
