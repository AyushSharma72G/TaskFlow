import { api } from "../../../shared/lib/axios";

import { type ActivityQuery } from "../types";

export const getActivityLogs = async (query: ActivityQuery) => {
  const res = await api.get("/activity-logs", {
    params: query,
  });
  return res.data.data;
};
