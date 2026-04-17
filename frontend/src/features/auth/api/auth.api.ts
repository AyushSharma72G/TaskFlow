import { api } from "../../../shared/lib/axios";
import type {
  AuthApiResponse,
  AuthUser,
  ChangePasswordPayload,
  LoginPayload,
  ProjectRoleData,
  RegisterPayload,
  UploadAvatarPayload,
  UpdateProfilePayload,
} from "../types";

export const authApi = {
  async login(payload: LoginPayload): Promise<AuthUser> {
    const response = await api.post<AuthApiResponse<AuthUser>>("/auth/login", payload);
    return response.data.data;
  },

  async register(payload: RegisterPayload): Promise<AuthUser> {
    const response = await api.post<AuthApiResponse<AuthUser>>("/auth/register", payload);
    return response.data.data;
  },

  async logout(): Promise<void> {
    await api.post("/auth/logout");
  },

  async refresh(): Promise<void> {
    await api.post("/auth/refresh");
  },

  async exchangeOAuthCode(code: string): Promise<AuthUser> {
    const response = await api.post<AuthApiResponse<AuthUser>>("/auth/oauth/exchange", { code });
    return response.data.data;
  },

  async getProfile(): Promise<AuthUser> {
    const response = await api.get<AuthApiResponse<AuthUser>>("/auth/profile");
    return response.data.data;
  },

  async updateProfile(payload: UpdateProfilePayload): Promise<AuthUser> {
    const response = await api.patch<AuthApiResponse<AuthUser>>("/auth/profile", payload);
    return response.data.data;
  },

  async uploadAvatar(payload: UploadAvatarPayload): Promise<AuthUser> {
    const formData = new FormData();
    formData.append("avatar", payload.avatar);

    const response = await api.patch<AuthApiResponse<AuthUser>>(
      "/auth/profile/avatar",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data.data;
  },

  async removeAvatar(): Promise<AuthUser> {
    const response = await api.delete<AuthApiResponse<AuthUser>>("/auth/profile/avatar");
    return response.data.data;
  },

  async changePassword(payload: ChangePasswordPayload): Promise<void> {
    await api.patch("/auth/change-password", payload);
  },

  async getCurrentUserRole(projectId: string): Promise<ProjectRoleData> {
    const response = await api.get<AuthApiResponse<ProjectRoleData>>("/auth/me/role", {
      params: { projectId },
    });
    return response.data.data;
  },
};
