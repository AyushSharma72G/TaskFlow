import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import {
  selectBootstrapStatus,
  selectIsAuthenticated,
} from "../../../features/auth/store/authSelectors";

type ProtectedRouteProps = {
  children: ReactNode;
};

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const bootstrapStatus = useAppSelector(selectBootstrapStatus);
  const location = useLocation();

  if (bootstrapStatus !== "ready") {
    return (
      <div className="grid min-h-screen place-items-center bg-bg px-4">
        <div className="rounded-lg border border-border bg-surface px-6 py-4 text-sm font-semibold text-text-secondary shadow-sm">
          Loading your workspace...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  return <>{children}</>;
}
