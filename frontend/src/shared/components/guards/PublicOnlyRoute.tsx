import type { ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAppSelector } from "../../../store/hooks";
import {
  selectBootstrapStatus,
  selectIsAuthenticated,
} from "../../../features/auth/store/authSelectors";

type PublicOnlyRouteProps = {
  children: ReactNode;
};

export default function PublicOnlyRoute({ children }: PublicOnlyRouteProps) {
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const bootstrapStatus = useAppSelector(selectBootstrapStatus);

  if (bootstrapStatus !== "ready") {
    return (
      <div className="grid min-h-screen place-items-center bg-bg px-4">
        <div className="rounded-lg border border-border bg-surface px-6 py-4 text-sm font-semibold text-text-secondary shadow-sm">
          Preparing authentication...
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}
