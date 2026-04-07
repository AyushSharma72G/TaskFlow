import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Task, TaskFilters } from "../types";
import {
  createTask,
  deleteTask,
  fetchTaskById,
  fetchTasks,
  generateTaskDescription,
  updateTask,
} from "./tasksThunks";

interface TasksState {
  tasks: Task[];
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;
  aiLoading: boolean;
  generatedDescription: string;
  filters: TaskFilters;
}

const initialState: TasksState = {
  tasks: [],
  selectedTask: null,
  loading: false,
  error: null,
  aiLoading: false,
  generatedDescription: "",
  filters: {
    status: "ALL",
    priority: "ALL",
    search: "",
  },
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setSelectedTask(state, action: PayloadAction<Task | null>) {
      state.selectedTask = action.payload;
    },
    setStatusFilter(state, action: PayloadAction<TaskFilters["status"]>) {
      state.filters.status = action.payload;
    },
    setPriorityFilter(state, action: PayloadAction<TaskFilters["priority"]>) {
      state.filters.priority = action.payload;
    },
    setSearchFilter(state, action: PayloadAction<string>) {
      state.filters.search = action.payload;
    },
    clearGeneratedDescription(state) {
      state.generatedDescription = "";
    },
    clearTasksError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // fetchTasks
      .addCase(fetchTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Something went wrong";
      })

      // fetchTaskById
      .addCase(fetchTaskById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTaskById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedTask = action.payload;
      })
      .addCase(fetchTaskById.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Something went wrong";
      })

      // createTask
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Something went wrong";
      })

      // updateTask
      .addCase(updateTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.map((task) =>
          task.id === action.payload.id ? action.payload : task,
        );

        if (state.selectedTask?.id === action.payload.id) {
          state.selectedTask = action.payload;
        }
      })
      .addCase(updateTask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Something went wrong";
      })

      // deleteTask
      .addCase(deleteTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTask.fulfilled, (state, action) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task.id !== action.payload);

        if (state.selectedTask?.id === action.payload) {
          state.selectedTask = null;
        }
      })
      .addCase(deleteTask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Something went wrong";
      })

      // AI description
      .addCase(generateTaskDescription.pending, (state) => {
        state.aiLoading = true;
        state.error = null;
      })
      .addCase(generateTaskDescription.fulfilled, (state, action) => {
        state.aiLoading = false;
        state.generatedDescription = action.payload;
      })
      .addCase(generateTaskDescription.rejected, (state, action) => {
        state.aiLoading = false;
        state.error = (action.payload as string) || "Something went wrong";
      });
  },
});

export const {
  setSelectedTask,
  setStatusFilter,
  setPriorityFilter,
  setSearchFilter,
  clearGeneratedDescription,
  clearTasksError,
} = tasksSlice.actions;

export default tasksSlice.reducer;
