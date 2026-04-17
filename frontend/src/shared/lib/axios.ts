import axios from "axios";

const axiosConfig = {
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
};

export const api = axios.create(axiosConfig);

const refreshClient = axios.create(axiosConfig);

let refreshPromise: Promise<void> | null = null;
const noRefreshEndpoints = ["/auth/login", "/auth/register", "/auth/refresh", "/auth/oauth/exchange"];

const startsWithAny = (value: string, prefixes: string[]): boolean =>
  prefixes.some((prefix) => value.startsWith(prefix));

const redirectToAuth = (): void => {
  if (window.location.pathname !== "/auth") {
    window.location.href = "/auth";
  }
};

const getRefreshPromise = (): Promise<void> => {
  if (!refreshPromise) {
    refreshPromise = refreshClient.post("/auth/refresh").then(() => undefined);
    refreshPromise.finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error?.config as
      | (typeof error.config & { _retry?: boolean })
      | undefined;
    const requestUrl = originalRequest?.url as string | undefined;
    const status = error?.response?.status as number | undefined;
    const shouldSkipRefresh =
      typeof requestUrl !== "string" || startsWithAny(requestUrl, noRefreshEndpoints);
    const canRefresh = status === 401 && originalRequest && !originalRequest._retry && !shouldSkipRefresh;

    if (canRefresh) {
      originalRequest._retry = true;

      try {
        await getRefreshPromise();
        return api(originalRequest);
      } catch (refreshError) {
        redirectToAuth();
        return Promise.reject(refreshError);
      }
    }

    if (status === 401 && shouldSkipRefresh) {
      redirectToAuth();
    }

    return Promise.reject(error);
  },
);
