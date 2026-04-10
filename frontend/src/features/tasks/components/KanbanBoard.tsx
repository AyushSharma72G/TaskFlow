// KanbanBoard.tsx
import type { Task, TaskStatus } from "../types";
import TaskCard from "./TaskCard";

interface KanbanBoardProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

const columns: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

export default function KanbanBoard({
  tasks,
  onEdit,
  onDelete,
}: KanbanBoardProps) {
  const getColumnTitle = (status: TaskStatus) => {
    if (status === "IN_PROGRESS") return "In Progress";
    if (status === "TODO") return "To Do";
    return "Done";
  };

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
      {columns.map((status) => {
        const columnTasks = tasks.filter((task) => task.status === status);

        return (
          <div
            key={status}
            className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
          >
            <h2 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
              {getColumnTitle(status)}
            </h2>

            <div className="space-y-4">
              {columnTasks.length ? (
                columnTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onEdit={onEdit}
                    onDelete={onDelete}
                  />
                ))
              ) : (
                <p className="text-sm text-[var(--color-text-secondary)]">
                  No tasks
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
