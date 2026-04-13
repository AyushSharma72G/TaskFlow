import { createAsyncThunk } from "@reduxjs/toolkit";
import { projectsApi } from "../api/projects.api";
import type {
  CreateProjectPayload,
  ProjectListItem,
  UpdateProjectPayload,
} from "../types";

export const fetchProjects = createAsyncThunk<
  ProjectListItem[],
  void,
  { rejectValue: string }
>("projects/fetchProjects", async (_, thunkAPI) => {
  try {
    return await projectsApi.getProjects();
  } catch (error: unknown) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || "Failed to load projects";
    return thunkAPI.rejectWithValue(
      Array.isArray(message) ? message.join(", ") : String(message),
    );
  }
});

export const createProject = createAsyncThunk<
  ProjectListItem[],
  CreateProjectPayload,
  { rejectValue: string }
>("projects/createProject", async (payload, thunkAPI) => {
  try {
    await projectsApi.createProject(payload);
    return await projectsApi.getProjects();
  } catch (error: unknown) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || "Failed to create project";
    return thunkAPI.rejectWithValue(
      Array.isArray(message) ? message.join(", ") : String(message),
    );
  }
});

export const updateProject = createAsyncThunk<
  ProjectListItem[],
  { projectId: string; payload: UpdateProjectPayload },
  { rejectValue: string }
>("projects/updateProject", async ({ projectId, payload }, thunkAPI) => {
  try {
    await projectsApi.updateProject(projectId, payload);
    return await projectsApi.getProjects();
  } catch (error: unknown) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || "Failed to update project";
    return thunkAPI.rejectWithValue(
      Array.isArray(message) ? message.join(", ") : String(message),
    );
  }
});

export const deleteProject = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("projects/deleteProject", async (projectId, thunkAPI) => {
  try {
    await projectsApi.deleteProject(projectId);
    return projectId;
  } catch (error: unknown) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message || "Failed to delete project";
    return thunkAPI.rejectWithValue(
      Array.isArray(message) ? message.join(", ") : String(message),
    );
  }
});
