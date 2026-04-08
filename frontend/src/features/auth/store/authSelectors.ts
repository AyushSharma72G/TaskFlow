import type { RootState } from "../../../store";

export const selectAuthUser = (state: RootState) => state.auth.user;
export const selectIsAuthenticated = (state: RootState) =>
  state.auth.isAuthenticated;
export const selectAuthStatus = (state: RootState) => state.auth.status;
export const selectAuthError = (state: RootState) => state.auth.error;
export const selectBootstrapStatus = (state: RootState) =>
  state.auth.bootstrapStatus;
export const selectBootstrapReady = (state: RootState) =>
  state.auth.bootstrapStatus === "ready";
export const selectRoleByProjectId =
  (projectId: string) => (state: RootState) =>
    state.auth.rolesByProject[projectId] ?? null;
