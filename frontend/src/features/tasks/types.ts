export type TaskStatus = "TODO" | "IN_PROGRESS" | "DONE";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  projectId?: string;
  assignedToId?: string;
  createdById?: string;
  dueDate?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateTaskPayload {
  title: string;
  description: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  assignedToId?: string;
  dueDate?: string | null;
}

export interface UpdateTaskPayload {
  title?: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  projectId?: string;
  assignedToId?: string;
  dueDate?: string | null;
}

export interface TaskFilters {
  status: TaskStatus | "ALL";
  priority: TaskPriority | "ALL";
  search: string;
}

export interface GenerateDescriptionPayload {
  title: string;
}

export interface GenerateDescriptionResponse {
  description: string;
}
