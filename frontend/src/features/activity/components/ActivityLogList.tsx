import { useSelector } from "react-redux";
import {
  selectActivityLogs,
  selectActivityError,
  selectSelectedProjectId,
  // selectUserProjects,
} from "../store/activitySelectors";
import ActivityLogItem from "./ActivityLogItem";
import { Activity, FilterX } from "lucide-react";
import { selectProjects } from "../../projects/store/projectsSelectors";
import { useAppSelector } from "../../../store/hooks";

const ActivityLogList = () => {
  const data = useSelector(selectActivityLogs);
  const error = useSelector(selectActivityError);
  const selectedProjectId = useSelector(selectSelectedProjectId);
  const projects = useAppSelector(selectProjects);

  const selectedProjectName =
    projects?.find((p) => String(p.id) === String(selectedProjectId))?.title ??
    null;

  const logs = data.logs || [];

  const isFiltered = Boolean(selectedProjectId);

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: "rgb(254 226 226)",
            color: "var(--color-danger)",
            flexShrink: 0,
          }}
        >
          <Activity size={30} />
        </span>
        <div>
          <p
            className="text-sm font-medium"
            style={{ color: "var(--color-danger)" }}
          >
            Failed to load activity
          </p>
          <p
            className="mt-0.5 text-xs max-w-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            {error}
          </p>
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    // Filtered empty — specific project has no logs
    if (isFiltered) {
      return (
        <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
          <span
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 48,
              height: 48,
              borderRadius: "50%",
              background: "rgb(219 234 254)",
              color: "var(--color-primary)",
            }}
          >
            <FilterX size={22} />
          </span>
          <div>
            <p
              className="text-sm font-medium"
              style={{ color: "var(--color-text-secondary)" }}
            >
              No activity in{" "}
              <span style={{ color: "var(--color-primary)", fontWeight: 600 }}>
                {"this project"}
              </span>
            </p>
            <p
              className="mt-0.5 text-xs"
              style={{ color: "var(--color-text-muted)" }}
            >
              Try selecting a different project or view all activity.
            </p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
        <span
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 48,
            height: 48,
            borderRadius: "50%",
            background: "var(--color-muted)",
            color: "var(--color-text-muted)",
          }}
        >
          <Activity size={22} />
        </span>
        <div>
          <p
            className="text-sm font-medium"
            style={{ color: "var(--color-text-secondary)" }}
          >
            No activity yet
          </p>
          <p
            className="mt-0.5 text-xs"
            style={{ color: "var(--color-text-muted)" }}
          >
            Actions on projects and tasks will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="relative"
      role="log"
      aria-label={
        isFiltered
          ? `Activity log for ${selectedProjectName ?? "selected project"}`
          : "Activity log — all projects"
      }
      aria-live="polite"
    >
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 16,
          top: 34,
          bottom: 8,
          width: 1,
          background: "var(--color-border)",
          pointerEvents: "none",
        }}
      />

      <div className="space-y-0">
        {logs.map((log: any, index: number) => (
          <div
            key={log.id}
            style={{
              paddingBottom: index !== logs.length - 1 ? "1rem" : 0,
              borderBottom:
                index !== logs.length - 1
                  ? "1px solid var(--color-border)"
                  : "none",
              marginBottom: index !== logs.length - 1 ? "1rem" : 0,
            }}
          >
            <ActivityLogItem log={log} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLogList;
