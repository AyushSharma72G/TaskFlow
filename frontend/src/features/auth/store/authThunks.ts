import { createAsyncThunk } from "@reduxjs/toolkit";
import { authApi } from "../api/auth.api";
import type {
  ChangePasswordPayload,
  LoginPayload,
  RegisterPayload,
  UpdateProfilePayload,
} from "../types";

const getErrorMessage = (error: any, fallback: string): string => {
  const message = error?.response?.data?.message;

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  if (Array.isArray(message)) {
    return message.map(String).join(", ");
  }

  if (message && typeof message === "object") {
    try {
      return JSON.stringify(message);
    } catch {
      return fallback;
    }
  }

  return fallback;
};

export const loginThunk = createAsyncThunk(
  "auth/login",
  async (payload: LoginPayload, thunkAPI) => {
    try {
      return await authApi.login(payload);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to login"));
    }
  },
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (payload: RegisterPayload, thunkAPI) => {
    try {
      return await authApi.register(payload);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to register"));
    }
  },
);

export const fetchProfileThunk = createAsyncThunk(
  "auth/fetchProfile",
  async (_, thunkAPI) => {
    try {
      return await authApi.getProfile();
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to fetch profile"),
      );
    }
  },
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, thunkAPI) => {
    try {
      await authApi.logout();
      return true;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to logout"));
    }
  },
);

export const fetchRoleByProjectThunk = createAsyncThunk(
  "auth/fetchRoleByProject",
  async (projectId: string, thunkAPI) => {
    try {
      return await authApi.getCurrentUserRole(projectId);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(getErrorMessage(error, "Failed to fetch role"));
    }
  },
);

export const updateProfileThunk = createAsyncThunk(
  "auth/updateProfile",
  async (payload: UpdateProfilePayload, thunkAPI) => {
    try {
      return await authApi.updateProfile(payload);
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to update profile"),
      );
    }
  },
);

export const changePasswordThunk = createAsyncThunk(
  "auth/changePassword",
  async (payload: ChangePasswordPayload, thunkAPI) => {
    try {
      await authApi.changePassword(payload);
      return true;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        getErrorMessage(error, "Failed to change password"),
      );
    }
  },
);
