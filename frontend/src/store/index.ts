import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../features/tasks/store/tasksSlice";
import authReducer from "../features/auth/store/authSlice";
export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
