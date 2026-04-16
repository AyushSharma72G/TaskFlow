import { useEffect } from "react";
import { useAppSelector } from "../../../store/hooks";
import {
  selectProjects,
  selectProjectsError,
  selectProjectsLoading,
} from "../../projects/store/projectsSelectors";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { fetchProjects } from "../../projects/store/projectsThunks";
import FallBackUIComponent from "../../../shared/components/FallBackUIComponent";
import type { AppDispatch } from "../../../store";
import PrimaryButton from "../../../shared/components/buttons/PrimaryButton";
import { GoPlus } from "react-icons/go";
import Loader from "../../../shared/components/Loader";

const ProjectBar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const projects = useAppSelector(selectProjects);
  const loading = useAppSelector(selectProjectsLoading);
  const error = useAppSelector(selectProjectsError);

  useEffect(() => {
    void dispatch(fetchProjects());
  }, [dispatch]);

  const toTitleCase = (str: string) => {
    return str
      .toLowerCase()
      .split(" ")
      .map((word) => {
        return word.charAt(0).toUpperCase() + word.slice(1);
      })
      .join(" ");
  };

  let recentProjects;
  if (projects.length > 4) {
    recentProjects = projects.slice(0, 4);
  } else {
    recentProjects = [...projects];
  }

  return (
    <div className="w-full px-2 md:px-0 ">
      <div className="flex justify-between w-full mt-10 mb-3 w-full items-center">
        <p className="font-[var(--font-weight-subheading)]">My Projects</p>
        <p
          onClick={() => navigate("/projects")}
          className="cursor-pointer text-[var(--color-primary-light)]"
        >
          View All
        </p>
      </div>

      {error ? (
        <div
          className="rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
          role="alert"
        >
          {error}
        </div>
      ) : null}

      {loading ? (
        <Loader />
      ) : recentProjects.length === 0 ? (
        <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] bg-[var(--color-surface)] p-8 shadow-[var(--shadow-sm)] md:p-10">
          <p className="max-w-md text-left text-[var(--color-text-secondary)]">
            You don't have any projects yet. Create one to get started and begin
            organizing your work.
            <PrimaryButton
              type="button"
              className="mt-6"
              onClick={() => navigate("/projects")}
              icon={<GoPlus className="h-4 w-4" />}
            >
              New project
            </PrimaryButton>
          </p>
        </div>
      ) : (
        recentProjects.map((project) => {
          const completed = project.completedTasks || 0;
          const total = project.totalTasks || 0;
          const percentage = total > 0 ? (completed / total) * 100 : 0;
          return (
            <div className="shadow-[var(--shadow-md)] rounded-sm w-full flex flex-col mt-2 p-4 bg-white">
              <p className="font-[var(--font-weight-subheading)] text-[var(--color-text-secondary)]">
                {toTitleCase(project.title)}
              </p>

              <p className="font-[var(--font-weight-description)] text-[var(--color-text-secondary)]">
                <span className="font-[var(--font-weight-subheading)]">
                  Due:
                </span>{" "}
                {new Date(project.dueDate).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>

              <div className="flex justify-between text-[var(--color-text-secondary)]">
                <p className="font-[var(--font-weight-description)]">
                  {project.completedTasks}/{project.totalTasks} tasks
                </p>
                <div className="flex-1 min-w-[120px] bg-gray-200 rounded-full h-2.5 overflow-hidden">
                  <div
                    className="bg-[var(--color-primary-light)] h-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, Math.max(0, percentage))}%`,
                    }}
                  ></div>
                </div>
                <div>{Math.round(percentage)}%</div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
};

export default ProjectBar;
