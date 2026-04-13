import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Task, TaskFilters, TaskUser, TaskStatus } from "../types";
import {
  createTask,
  deleteTask,
  fetchMembers,
  fetchTasks,
  generateTaskDescription,
  updateTask,
} from "./tasksThunks";

interface TasksState {
  tasks: Task[];
  members: TaskUser[];
  nextCursor: string | null; // for pagination
  hasNextPage: boolean;
  loadingMore: boolean;
  selectedTask: Task | null;
  loading: boolean;
  error: string | null;
  aiLoading: boolean;
  generatedDescription: string;
  filters: TaskFilters;
}

const initialState: TasksState = {
  tasks: [],
  members: [],
  selectedTask: null,
  nextCursor: null,
  hasNextPage: false,
  loadingMore: false,
  loading: false,
  error: null,
  aiLoading: false,
  generatedDescription: "",
  filters: {
    status: "ALL",
    priority: "ALL",
    assigneeId: "ALL",
  },
};

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    setStatusFilter(state, action: PayloadAction<TaskFilters["status"]>) {
      state.filters.status = action.payload;
    },

    setPriorityFilter(state, action: PayloadAction<TaskFilters["priority"]>) {
      state.filters.priority = action.payload;
    },

    setAssignedToFilter(
      state,
      action: PayloadAction<TaskFilters["assigneeId"]>,
    ) {
      state.filters.assigneeId = action.payload;
    },

    clearGeneratedDescription(state) {
      state.generatedDescription = "";
    },

    clearTasksError(state) {
      state.error = null;
    },

    setTaskStatusOptimistic(
      state,
      action: PayloadAction<{ taskId: string; status: TaskStatus }>,
    ) {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.status = action.payload.status;
      }
    },
    revertTaskStatus(
      state,
      action: PayloadAction<{ taskId: string; previousStatus: TaskStatus }>,
    ) {
      const task = state.tasks.find((t) => t.id === action.payload.taskId);
      if (task) {
        task.status = action.payload.previousStatus;
      }
    },
  },

  extraReducers: (builder) => {
    builder
      // fetchTasks
      .addCase(fetchTasks.pending, (state, action) => {
        if (action.meta.arg.cursor) {
          state.loadingMore = true;
        } else {
          state.loading = true;
          state.tasks = [];
        }
        state.error = null;
      })
      .addCase(fetchTasks.fulfilled, (state, action) => {
        const { items, nextCursor, hasNextPage } = action.payload;

        if (action.meta.arg.cursor) {  // this is meta data by the redux thunk to know if we did the used the cursor or not 
          state.tasks.push(...items); // append on paginate
        } else {
          state.tasks = items;
        }

        state.nextCursor = nextCursor;
        state.hasNextPage = hasNextPage;
        state.loading = false;
        state.loadingMore = false;
      })
      .addCase(fetchTasks.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = (action.payload as string) || "Something went wrong";
      })

      // createTask
      .addCase(createTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.tasks.unshift(action.payload);
      })
      .addCase(createTask.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || "Something went wrong";
      })

      // updateTask
      .addCase(updateTask.pending, (state) => {
        // state.loading = true;
        state.error = null;
      })
      .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
        // state.loading = false;
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
      .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
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
      .addCase(
        generateTaskDescription.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.aiLoading = false;
          state.generatedDescription = action.payload;
        },
      )
      .addCase(generateTaskDescription.rejected, (state, action) => {
        state.aiLoading = false;
        state.error = (action.payload as string) || "Something went wrong";
      })

      // fetch members
      .addCase(fetchMembers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMembers.fulfilled, (state, action) => {
        state.loading = false;
        state.members = action.payload;
      })
      .addCase(fetchMembers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed";
      });
  },
});

export const {
  setStatusFilter,
  setPriorityFilter,
  setAssignedToFilter,
  clearGeneratedDescription,
  clearTasksError,
  setTaskStatusOptimistic,
  revertTaskStatus,
} = tasksSlice.actions;

export default tasksSlice.reducer;
