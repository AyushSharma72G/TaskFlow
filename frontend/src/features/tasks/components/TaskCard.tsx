import { useState } from "react";
import type { Task } from "../types";
import { CalendarDays, Pencil, Trash2, User } from "lucide-react";
import { DeleteModal } from "./DeleteModal";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const statusClassMap: Record<Task["status"], string> = {
    TODO: "status-todo",
    IN_PROGRESS: "status-in-progress",
    DONE: "status-done",
  };

  const priorityClassMap: Record<Task["priority"], string> = {
    LOW: "priority-low",
    MEDIUM: "priority-medium",
    HIGH: "priority-high",
  };

  const formattedStatus =
    task.status === "IN_PROGRESS" ? "IN PROGRESS" : task.status;

  const assigneeNames =
    task.assignees.length > 0
      ? task.assignees.map((user) => user?.user?.name).join(", ")
      : "Unassigned";

  const handleDeleteConfirm = () => {
    onDelete?.(task.id);
    setShowDeleteModal(false);
  };

  return (
    <>
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
              onClick={() => setShowDeleteModal(true)}
              className="inline-flex items-center gap-1 rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
            >
              <Trash2 size={14} />
              Delete
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className={`status ${statusClassMap[task.status]}`}>
            {formattedStatus}
          </span>

          <span className={`priority ${priorityClassMap[task.priority]}`}>
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

      {showDeleteModal && (
        <DeleteModal
          taskId={task.id}
          onDelete={handleDeleteConfirm}
          onCancel={() => setShowDeleteModal(false)}
        />
      )}
    </>
  );
}
