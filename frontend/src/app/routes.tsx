import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../shared/components/layout/AppLayout";
import {
  ActivityPage,
  DashboardPage,
  HomePage,
  ProfilePage,
  ProjectsPage,
  // TasksPage,
} from "./placeholderPages";
import TasksPage from "../features/tasks/pages/TasksPage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "dashboard",
        element: <DashboardPage />,
      },
      {
        path: "projects",
        element: <ProjectsPage />,
      },
      {
        path: "project/:id",
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
      {
        path: "",
        element: <ProfilePage />,
      },
    ],
  },
]);
