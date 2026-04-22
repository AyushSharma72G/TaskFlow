import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { type AppDispatch } from "../../../store";
import {
  selectActivityError,
  selectActivityLoading,
  selectActivityLogs,
} from "../../activity/store/activitySelectors";
import { useEffect } from "react";
import { fetchActivityLogs } from "../../activity/store/activityThunk";
import ActivityLogItem from "../../activity/components/ActivityLogItem";
import Loader from "../../../shared/components/Loader";

const RecentActivity = () => {
  const naviagte = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const data = useSelector(selectActivityLogs);
  const loading = useSelector(selectActivityLoading);
  const error = useSelector(selectActivityError);
  const logs = data.logs || [];

  useEffect(() => {
    dispatch(fetchActivityLogs({}));
  }, [dispatch]);

  let activityLog;
  if (logs.length > 4) {
    activityLog = logs.slice(0, 4);
  } else {
    activityLog = logs;
  }

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between w-full  mb-3 w-full items-center">
        <p className="font-[var(--font-weight-subheading)]">Recent Activity</p>
        <p
          onClick={() => naviagte("/activity")}
          className="text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          View All
        </p>
      </div>

      {error ? (
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
      ) : null}

      {loading && logs.length === 0 ? (
        <Loader />
      ) : logs.length === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] p-6 text-center text-[var(--color-text-muted)]">
          No Activity found.
        </div>
      ) : (
        activityLog.map((log: any) => (
          <div
            key={log.id}
            className="flex items-center flex-row gap-5 p-3 w-full h-full bg-white shadow-[var(--shadow-lg)]"
          >
            <ActivityLogItem log={log} />
          </div>
        ))
      )}
    </div>
  );
};

export default RecentActivity;
