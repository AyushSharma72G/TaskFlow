import { createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "../types";
import {
  changePasswordThunk,
  fetchProfileThunk,
  fetchRoleByProjectThunk,
  loginThunk,
  removeAvatarThunk,
  logoutThunk,
  registerThunk,
  uploadAvatarThunk,
  updateProfileThunk,
} from "./authThunks";

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  status: "idle",
  bootstrapStatus: "idle",
  error: null,
  rolesByProject: {},
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearAuthError(state) {
      state.error = null;
    },
    clearAuthState(state) {
      state.user = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.error = null;
      state.rolesByProject = {};
      state.bootstrapStatus = "ready";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Login failed";
        state.isAuthenticated = false;
      })

      .addCase(registerThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
        state.error = null;
      })
      .addCase(registerThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Registration failed";
        state.isAuthenticated = false;
      })

      .addCase(fetchProfileThunk.pending, (state) => {
        state.bootstrapStatus = "loading";
        state.error = null;
      })
      .addCase(fetchProfileThunk.fulfilled, (state, action) => {
        state.user = action.payload;
        state.isAuthenticated = true;
        state.bootstrapStatus = "ready";
      })
      .addCase(fetchProfileThunk.rejected, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.bootstrapStatus = "ready";
      })

      .addCase(logoutThunk.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.status = "idle";
        state.error = null;
        state.rolesByProject = {};
      })

      .addCase(fetchRoleByProjectThunk.fulfilled, (state, action) => {
        state.rolesByProject[action.payload.projectId] = action.payload.role;
      })

      .addCase(updateProfileThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(updateProfileThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(updateProfileThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Profile update failed";
      })

      .addCase(uploadAvatarThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(uploadAvatarThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(uploadAvatarThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Avatar upload failed";
      })

      .addCase(removeAvatarThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(removeAvatarThunk.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(removeAvatarThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Avatar removal failed";
      })

      .addCase(changePasswordThunk.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(changePasswordThunk.fulfilled, (state) => {
        state.status = "succeeded";
      })
      .addCase(changePasswordThunk.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Change password failed";
      });
  },
});

export const { clearAuthError, clearAuthState } = authSlice.actions;

export default authSlice.reducer;
