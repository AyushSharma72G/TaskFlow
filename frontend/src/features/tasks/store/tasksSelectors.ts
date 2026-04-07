import type { RootState } from "../../../store/index";

export const selectTasksState = (state: RootState) => state.tasks;

export const selectAllTasks = (state: RootState) => state.tasks.tasks;
export const selectTasksLoading = (state: RootState) => state.tasks.loading;
export const selectTasksError = (state: RootState) => state.tasks.error;
export const selectSelectedTask = (state: RootState) =>
  state.tasks.selectedTask;
export const selectTaskFilters = (state: RootState) => state.tasks.filters;
export const selectAiLoading = (state: RootState) => state.tasks.aiLoading;
export const selectGeneratedDescription = (state: RootState) =>
  state.tasks.generatedDescription;

export const selectFilteredTasks = (state: RootState) => {
  const { tasks, filters } = state.tasks;

  return tasks.filter((task) => {
    const matchesStatus =
      filters.status === "ALL" || task.status === filters.status;

    const matchesPriority =
      filters.priority === "ALL" || task.priority === filters.priority;

    const search = filters.search.trim().toLowerCase();

    const matchesSearch =
      !search ||
      task.title.toLowerCase().includes(search) ||
      task.description.toLowerCase().includes(search);

    return matchesStatus && matchesPriority && matchesSearch;
  });
};
