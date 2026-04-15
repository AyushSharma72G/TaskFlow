import { createAsyncThunk } from "@reduxjs/toolkit";
import { projectsApi } from "../api/projects.api";
import type {
  CreateProjectPayload,
  GetProjectsParams,
  PaginatedProjectsResponse,
  UpdateProjectPayload,
} from "../types";

export const fetchProjects = createAsyncThunk<
  PaginatedProjectsResponse & { append: boolean },
  (GetProjectsParams & { append?: boolean }) | void,
  { rejectValue: string }
>("projects/fetchProjects", async (args, thunkAPI) => {
  const params = args ?? {};
  try {
    const response = await projectsApi.getProjects({
      cursor: params.cursor,
      limit: params.limit,
      search: params.search,
      ownerOnly: params.ownerOnly,
      dueFilter: params.dueFilter,
    });
    return {
      ...response,
      append: Boolean(params.append),
    };
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
  PaginatedProjectsResponse,
  { payload: CreateProjectPayload; query?: GetProjectsParams },
  { rejectValue: string }
>("projects/createProject", async ({ payload, query }, thunkAPI) => {
  try {
    await projectsApi.createProject(payload);
    return await projectsApi.getProjects(query);
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
  PaginatedProjectsResponse,
  { projectId: string; payload: UpdateProjectPayload; query?: GetProjectsParams },
  { rejectValue: string }
>("projects/updateProject", async ({ projectId, payload, query }, thunkAPI) => {
  try {
    await projectsApi.updateProject(projectId, payload);
    return await projectsApi.getProjects(query);
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
