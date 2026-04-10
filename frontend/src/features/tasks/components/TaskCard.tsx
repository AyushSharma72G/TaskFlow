// TaskCard.tsx
import type { Task } from "../types";
import { CalendarDays, Pencil, Trash2, User } from "lucide-react";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const statusClasses: Record<Task["status"], string> = {
    TODO: "bg-blue-50 text-blue-700 border border-blue-100",
    IN_PROGRESS: "bg-amber-50 text-amber-700 border border-amber-100",
    DONE: "bg-green-50 text-green-700 border border-green-100",
  };

  const priorityClasses: Record<Task["priority"], string> = {
    LOW: "bg-slate-100 text-slate-700 border border-slate-200",
    MEDIUM: "bg-yellow-50 text-yellow-700 border border-yellow-100",
    HIGH: "bg-red-50 text-red-700 border border-red-100",
  };

  const formattedStatus =
    task.status === "IN_PROGRESS" ? "In Progress" : task.status;

  const assigneeNames =
    task.assignees.length > 0
      ? task.assignees.map((user) => user?.user?.name).join(", ")
      : "Unassigned";

  return (
    <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-5 shadow-[var(--shadow-sm)] transition hover:shadow-[var(--shadow-md)]">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-lg font-semibold text-[var(--color-text-primary)]">
            {task.title}
          </h3>

          <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--color-text-secondary)]">
            {task.description || "No description provided."}
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <button
            type="button"
            onClick={() => onEdit?.(task)}
            className="inline-flex items-center gap-1 rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
          >
            <Pencil size={14} />
            Edit
          </button>

          <button
            type="button"
            onClick={() => onDelete?.(task.id)}
            className="inline-flex items-center gap-1 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
          >
            <Trash2 size={14} />
            Delete
          </button>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${statusClasses[task.status]}`}
        >
          {formattedStatus}
        </span>

        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${priorityClasses[task.priority]}`}
        >
          {task.priority}
        </span>

        <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
          <User size={13} />
          {assigneeNames}
        </span>

        {task.dueDate && (
          <span className="inline-flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-hover)] px-3 py-1 text-xs font-medium text-[var(--color-text-secondary)]">
            <CalendarDays size={13} />
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
