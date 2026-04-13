import { api } from "../../../shared/lib/axios";
import type {
  CreateProjectPayload,
  ProjectListItem,
  UpdateProjectPayload,
} from "../types";

export const projectsApi = {
  async getProjects(): Promise<ProjectListItem[]> {
    const response = await api.get<ProjectListItem[]>("/projects");
    return response.data;
  },

  async createProject(payload: CreateProjectPayload): Promise<void> {
    await api.post("/projects", payload);
  },

  async updateProject(
    projectId: string,
    payload: UpdateProjectPayload,
  ): Promise<void> {
    await api.patch(`/projects/${projectId}`, payload);
  },

  async deleteProject(projectId: string): Promise<void> {
    await api.delete(`/projects/${projectId}`);
  },
};
