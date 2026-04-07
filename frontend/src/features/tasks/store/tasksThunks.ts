import { createAsyncThunk } from "@reduxjs/toolkit";
import { tasksApi } from "../api/tasks.api";
import { taskAiApi } from "../api/taskAi.api";
import type { CreateTaskPayload, Task, UpdateTaskPayload } from "../types";

export const fetchTasks = createAsyncThunk<Task[]>(
  "tasks/fetchTasks",
  async (_, thunkAPI) => {
    try {
      return await tasksApi.getTasks();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to fetch tasks",
      );
    }
  },
);

export const fetchTaskById = createAsyncThunk<Task, string>(
  "tasks/fetchTaskById",
  async (taskId, thunkAPI) => {
    try {
      return await tasksApi.getTaskById(taskId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to fetch task",
      );
    }
  },
);

export const createTask = createAsyncThunk<Task, CreateTaskPayload>(
  "tasks/createTask",
  async (payload, thunkAPI) => {
    try {
      return await tasksApi.createTask(payload);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to create task",
      );
    }
  },
);

export const updateTask = createAsyncThunk<
  Task,
  { taskId: string; payload: UpdateTaskPayload }
>("tasks/updateTask", async ({ taskId, payload }, thunkAPI) => {
  try {
    return await tasksApi.updateTask(taskId, payload);
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || "Failed to update task",
    );
  }
});

export const deleteTask = createAsyncThunk<string, string>(
  "tasks/deleteTask",
  async (taskId, thunkAPI) => {
    try {
      return await tasksApi.deleteTask(taskId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || "Failed to delete task",
      );
    }
  },
);

export const generateTaskDescription = createAsyncThunk<
  string,
  { title: string }
>("tasks/generateTaskDescription", async ({ title }, thunkAPI) => {
  try {
    const response = await taskAiApi.generateDescription({ title });
    return response.description;
  } catch (error: any) {
    return thunkAPI.rejectWithValue(
      error?.response?.data?.message || "Failed to generate description",
    );
  }
});
