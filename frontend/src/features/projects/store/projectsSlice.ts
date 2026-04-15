import { createSlice } from "@reduxjs/toolkit";
import type { ProjectListItem } from "../types";
import {
  createProject,
  deleteProject,
  fetchProjects,
  updateProject,
} from "./projectsThunks";

function mergeUniqueProjects(
  current: ProjectListItem[],
  incoming: ProjectListItem[],
): ProjectListItem[] {
  const seen = new Set(current.map((project) => project.id));
  const next = [...current];

  for (const project of incoming) {
    if (seen.has(project.id)) continue;
    seen.add(project.id);
    next.push(project);
  }

  return next;
}

interface ProjectsState {
  items: ProjectListItem[];
  loading: boolean;
  loadingMore: boolean;
  error: string | null;
  nextCursor: string | null;
}

const initialState: ProjectsState = {
  items: [],
  loading: true,
  loadingMore: false,
  error: null,
  nextCursor: null,
};

const projectsSlice = createSlice({
  name: "projects",
  initialState,
  reducers: {
    clearProjectsError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProjects.pending, (state, action) => {
        const isLoadMore = Boolean(action.meta.arg?.append);
        state.loading = !isLoadMore;
        state.loadingMore = isLoadMore;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.items = action.payload.append
          ? mergeUniqueProjects(state.items, action.payload.data)
          : action.payload.data;
        state.nextCursor = action.payload.nextCursor;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.loadingMore = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(createProject.pending, (state) => {
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.items = action.payload.data;
        state.nextCursor = action.payload.nextCursor;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong";
      })

      .addCase(updateProject.pending, (state) => {
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.items = action.payload.data;
        state.nextCursor = action.payload.nextCursor;
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong";
      })

      .addCase(deleteProject.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong";
      });
  },
});

export const { clearProjectsError } = projectsSlice.actions;
export default projectsSlice.reducer;
