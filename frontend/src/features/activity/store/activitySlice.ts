import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { fetchActivityLogs } from "./activityThunk";
import { type ActivityLog } from "../types";

export interface ActivityState {
  logs: ActivityLog[];
  loading: boolean;
  error: string | null;
  selectedProjectId: string | null;
}

const initialState: ActivityState = {
  logs: [],
  loading: false,
  error: null,
  selectedProjectId: null,
};

const activitySlice = createSlice({
  name: "activity",
  initialState,
  reducers: {
    setProjectFilter(state, action: PayloadAction<string | null>) {
      state.selectedProjectId = action.payload;
    },
    clearLogs(state) {
      state.logs = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchActivityLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActivityLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.logs = action.payload;
      })
      .addCase(fetchActivityLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setProjectFilter, clearLogs } = activitySlice.actions;
export default activitySlice.reducer;