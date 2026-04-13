export const selectActivityLogs = (state: any) => state.activity?.logs ?? [];
export const selectActivityLoading = (state: any) => state.activity.loading;
export const selectActivityError = (state: any) => state.activity.error;
export const selectSelectedProjectId = (state: any) =>
  state.activity.selectedProjectId;