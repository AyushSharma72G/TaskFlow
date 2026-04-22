import { FolderKanban } from "lucide-react";
import { ListTodo } from "lucide-react";
import { CircleCheck } from "lucide-react";
import { CircleDashed } from "lucide-react";
import { useAppSelector } from "../../../store/hooks";
import { selectProjects } from "../../projects/store/projectsSelectors";

const ProgressBar = () => {
  const projects = useAppSelector(selectProjects);

  const totalTasks = () => {
    return (projects ?? []).reduce((acc, project) => {
      return acc + (project.totalTasks ?? 0);
    }, 0);
  };

  const completedTasks = () => {
    return (projects ?? []).reduce((acc, project) => {
      return acc + (project.completedTasks ?? 0);
    }, 0);
  };
  const progress = Math.round((completedTasks() * 100) / totalTasks()) || 0;

  const progressBarConstants = [
    {
      id: 1,
      icon: (
        <FolderKanban
          color="var( --color-primary)"
          size={30}
          style={{
            color: "--color-primary-dark",
            background: "--color-primary-dark",
          }}
        />
      ),
      count: projects.length,
      progress: "Projects",
    },
    {
      id: 2,
      icon: <ListTodo color="var( --color-primary)" size={30} />,
      count: totalTasks(),
      progress: "Tasks",
    },
    {
      id: 3,
      icon: <CircleCheck size={30} color="#87ae73" />,
      count: completedTasks(),
      progress: "Completed",
    },
    {
      id: 4,
      icon: <CircleDashed size={30} color="var( --color-primary)" />,
      count: `${progress} %`,
      progress: "Overall Progress",
    },
  ];

  return (
    <div className="grid gap-3 grid-cols-2 md:grid-cols-4">
      {progressBarConstants.map((progress) => (
        <div className="shadow-[var(--shadow-md)] rounded-sm flex items-center p-3 bg-white gap-3 w-full">
          <div className="shrink-0">{progress.icon}</div>

          <div className="flex flex-col min-w-0">
            <p className="font-[var(--font-weight-heading)] text-[var(--color-text-secondary)]">
              {progress.count}
            </p>
            <p className="font-[var(--font-weight-subheading)] text-[var(--color-text-secondary)] truncate">
              {progress.progress}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ProgressBar;
