import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const requestUrl = error?.config?.url as string | undefined;
    const isAuthPage = typeof requestUrl === "string" && requestUrl.includes("/auth");

    if (!isAuthPage && error?.response?.status === 401 && window.location.pathname !== "/auth") {
      window.location.href = "/auth";
    }

    return Promise.reject(error);
  },
);
