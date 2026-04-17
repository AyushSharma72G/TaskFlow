import { configureStore } from "@reduxjs/toolkit";
import tasksReducer from "../features/tasks/store/tasksSlice";
import authReducer from "../features/auth/store/authSlice";
import projectsReducer from "../features/projects/store/projectsSlice";
import activityReducer from "../features/activity/store/activitySlice";
export const store = configureStore({
  reducer: {
    tasks: tasksReducer,
    auth: authReducer,
    projects: projectsReducer,
    activity: activityReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
//  Take whatever shape store.getState() returns
// Use that as the type of the full Redux state
export type AppDispatch = typeof store.dispatch;

// this file makes a global store for all the states in the application like tasks,auth etc
