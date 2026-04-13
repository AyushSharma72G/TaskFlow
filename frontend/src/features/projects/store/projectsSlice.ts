import { createSlice } from "@reduxjs/toolkit";
import type { ProjectListItem } from "../types";
import {
  createProject,
  deleteProject,
  fetchProjects,
  updateProject,
} from "./projectsThunks";

interface ProjectsState {
  items: ProjectListItem[];
  loading: boolean;
  error: string | null;
}

const initialState: ProjectsState = {
  items: [],
  loading: true,
  error: null,
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
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      })

      .addCase(createProject.pending, (state) => {
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.items = action.payload;
      })
      .addCase(createProject.rejected, (state, action) => {
        state.error = action.payload || "Something went wrong";
      })

      .addCase(updateProject.pending, (state) => {
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.items = action.payload;
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
