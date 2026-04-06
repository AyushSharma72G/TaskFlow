import axios from "axios";

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 10000,
  withCredentials: true, // send cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Response interceptor (central error handling)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // User is not authenticated or session expired
      // later you can redirect to login or clear state
      console.warn("Unauthorized - please login again");
    }

    return Promise.reject(error);
  },
);
