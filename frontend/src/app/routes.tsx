import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../shared/components/layout/AppLayout";
import {
  ActivityPage,
  DashboardPage,
  ProfilePage,
  ProjectsPage,
  TasksPage,
} from "./placeholderPages";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "tasks",
        element: <TasksPage />,
      },
      {
        path: "activity",
        element: <ActivityPage />,
      },
      {
        path: "profile",
        element: <ProfilePage />,
      },
    ],
  },
]);
