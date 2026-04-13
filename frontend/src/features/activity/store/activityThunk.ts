import { createAsyncThunk } from "@reduxjs/toolkit";
import { getActivityLogs } from "../api/activity.api";
import { type ActivityQuery } from "../types";

export const fetchActivityLogs = createAsyncThunk(
  "activity/fetchLogs",
  async (query: ActivityQuery, { rejectWithValue }) => {
    try {
      return await getActivityLogs(query);
    } catch (err: any) {
      return rejectWithValue(
        err?.response?.data?.message || "Failed to fetch activity logs"
      );
    }
  }
);

