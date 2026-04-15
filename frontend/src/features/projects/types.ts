export interface ProjectAvatar {
  id: string;
  name: string;
  avatarUrl: string | null;
}

export interface ProjectListItem {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  createdAt: string;
  ownerId: string;
  memberCount: number;
  totalTasks: number;
  completedTasks: number;
  avatars: ProjectAvatar[];
}

export interface GetProjectsParams {
  cursor?: string;
  limit?: number;
  search?: string;
  ownerOnly?: boolean;
  dueFilter?: ProjectDueFilter;
}

export type ProjectDueFilter =
  | "all"
  | "overdue"
  | "today"
  | "this_week"
  | "next_30_days";

export interface PaginatedProjectsResponse {
  data: ProjectListItem[];
  nextCursor: string | null;
}

export interface CreateProjectPayload {
  title: string;
  description?: string;
  dueDate: string;
}

export interface UpdateProjectPayload {
  title?: string;
  description?: string;
  dueDate?: string;
}
