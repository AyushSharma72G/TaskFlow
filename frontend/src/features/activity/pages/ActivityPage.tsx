import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivityLogs } from "../store/activityThunk";
import ActivityLogFilter from "../components/ActivityLogFilter";
import ActivityLogList from "../components/ActivityLogList";
import type { AppDispatch } from "../../../store/index";
import { selectActivityLoading } from "../store/activitySelectors";
import Loader from "../../../shared/components/Loader";

const ActivityPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const loading = useSelector(selectActivityLoading);

  useEffect(() => {
    dispatch(fetchActivityLogs({}));
  }, [dispatch]);

  return (
    <div className="space-y-4">
      <h1 className="text-[var(--text-heading)] font-[var(--font-weight-heading)] text-2xl">
        Activity Logs
      </h1>
      <ActivityLogFilter />
      {loading ? (
        <div className="flex justify-center items-center h-[calc(100vh-160px)]">
          <Loader />
        </div>
      ) : (
        <ActivityLogList />
      )}
    </div>
  );
};

export default ActivityPage;
