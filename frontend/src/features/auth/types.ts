export interface AuthUser {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string | null;
  provider?: string | null;
  providerId?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface UpdateProfilePayload {
  name?: string;
  avatarUrl?: string;
}

export interface ChangePasswordPayload {
  oldPassword: string;
  newPassword: string;
}

export type RoleName = "OWNER" | "MEMBER" | null;

export interface ProjectRoleData {
  projectId: string;
  role: RoleName;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  status: "idle" | "loading" | "succeeded" | "failed";
  bootstrapStatus: "idle" | "loading" | "ready";
  error: string | null;
  rolesByProject: Record<string, RoleName>;
}
