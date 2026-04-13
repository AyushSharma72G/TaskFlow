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
