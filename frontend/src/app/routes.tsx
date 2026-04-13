import { createBrowserRouter } from "react-router-dom";
import { AppLayout } from "../shared/components/layout/AppLayout";
import ProtectedRoute from "../shared/components/guards/ProtectedRoute";
import PublicOnlyRoute from "../shared/components/guards/PublicOnlyRoute";
import AuthPage from "../features/auth/pages/AuthPage";
import ProfilePage from "../features/auth/pages/ProfilePage";
import { DashboardPage, HomePage } from "./placeholderPages";
import TasksPage from "../features/tasks/pages/TasksPage";
import ProjectsPage from "../features/projects/pages/ProjectsPage";
import ActivityPage from "../features/activity/pages/ActivityPage";

export const router = createBrowserRouter([
  {
    path: "/auth",
    element: (
      <PublicOnlyRoute>
        <AuthPage />
      </PublicOnlyRoute>
    ),
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <AppLayout />
      </ProtectedRoute>
    ),
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
