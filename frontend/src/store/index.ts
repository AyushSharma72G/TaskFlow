import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../features/tasks/store/tasksSlice";
import authReducer from "../features/auth/store/authSlice";
import projectsReducer from "../features/projects/store/projectsSlice";
export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    auth: authReducer,
    projects: projectsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
