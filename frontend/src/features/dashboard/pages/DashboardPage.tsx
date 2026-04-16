import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import {
  selectProjects,
  selectProjectsLoading,
} from "../../projects/store/projectsSelectors";
import { selectAuthUser } from "../../auth/store/authSelectors";
import { fetchProjects } from "../../projects/store/projectsThunks";

import Welcome from "../components/Navbar";
import ProgressBar from "../components/ProgressBar";
import RecentProjects from "../components/ProjectBar";
import RecentActivity from "../components/RecentActivity";
import Loader from "../../../shared/components/Loader";

const DashboardPage = () => {
  const dispatch = useAppDispatch();
  const projects = useAppSelector(selectProjects);
  const loading = useAppSelector(selectProjectsLoading);
  const user = useAppSelector(selectAuthUser);

  useEffect(() => {
    dispatch(fetchProjects({ limit: 10 }));
  }, [dispatch]);

  return (
    <div className="bg-[var(--color-bg)] pt-3 space-y-6">
      <Welcome />
      <ProgressBar />
      {loading && projects.length === 0 ? (
        <div className="flex justify-center py-20">
          <Loader />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <RecentProjects projects={projects} currentUserId={user?.id || ""} />
          <RecentActivity />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
