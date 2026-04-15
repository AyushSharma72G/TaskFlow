import type { RootState } from "../../../store";

export const selectProjects = (state: RootState) => state.projects.items;
export const selectProjectsLoading = (state: RootState) => state.projects.loading;
export const selectProjectsLoadingMore = (state: RootState) =>
  state.projects.loadingMore;
export const selectProjectsError = (state: RootState) => state.projects.error;
export const selectProjectsNextCursor = (state: RootState) =>
  state.projects.nextCursor;
