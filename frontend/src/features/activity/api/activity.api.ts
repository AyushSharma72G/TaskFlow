import axios from "axios";

import { type ActivityQuery } from "../types";

export const getActivityLogs = async (query: ActivityQuery) => {
  const res = await axios.get(import.meta.env.VITE_API_BASE_URL + "/activity-logs", {
    params: query,
    withCredentials: true,
  });
  return res.data.data;
};