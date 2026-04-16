import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import ProjectCard from "../../projects/components/ProjectCard";
import { projectProgress } from "../../projects/pages/ProjectsPage";
import type { ProjectListItem } from "../../projects/types";

type RecentProjectsProps = {
  projects: ProjectListItem[];
  currentUserId: string;
};

export default function RecentProjects({
  projects,
  currentUserId,
}: RecentProjectsProps) {
  const navigate = useNavigate();

  const recentItems = useMemo(() => {
    return [...projects]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
      .slice(0, 2);
  }, [projects]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-[var(--color-text-primary)]">
          Recent Projects
        </h2>
        <button
          onClick={() => navigate("/projects")}
          className="text-sm font-medium text-[var(--color-primary)] hover:underline"
        >
          View All
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {recentItems.length > 0 ? (
          recentItems.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              progressPercent={projectProgress(project)}
              canManage={project.ownerId === currentUserId}
              onEdit={() => navigate(`/projects`)}
              onDelete={() => navigate(`/projects`)}
            />
          ))
        ) : (
          <div className="rounded-[var(--radius-xl)] border border-dashed border-[var(--color-border)] p-6 text-center text-[var(--color-text-muted)]">
            No projects found.
          </div>
        )}
      </div>
    </div>
  );
}
