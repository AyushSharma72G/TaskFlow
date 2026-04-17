// src/features/tasks/components/TaskDetailModal.tsx
import { X } from "lucide-react";
import type { Task } from "../types";

const STATUS_CONFIG = {
  TODO: { label: "To do", bg: "#D3D1C7", color: "#2C2C2A" },
  IN_PROGRESS: { label: "In progress", bg: "#B5D4F4", color: "#0C447C" },
  DONE: { label: "Done", bg: "#C0DD97", color: "#27500A" },
} satisfies Record<string, { label: string; bg: string; color: string }>;

const PRIORITY_CONFIG = {
  LOW: { label: "Low", bg: "#D3D1C7", color: "#2C2C2A" },
  MEDIUM: { label: "Medium", bg: "#FAC775", color: "#633806" },
  HIGH: { label: "High", bg: "#F5C4B3", color: "#4A1B0C" },
} satisfies Record<string, { label: string; bg: string; color: string }>;

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? "")
    .join("");
}

function formatDate(dateStr?: string | null) {
  if (!dateStr) return null;
  return new Date(dateStr).toLocaleDateString(undefined, {
    dateStyle: "medium",
  });
}

type Props = {
  task: Task;
  onClose: () => void;
};

export default function TaskDetailModal({ task, onClose }: Props) {
  const status = STATUS_CONFIG[task.status] ?? {
    label: task.status,
    bg: "#3B82F6",
    color: "#2C2C2A",
  };
  const priority = PRIORITY_CONFIG[task.priority] ?? {
    label: task.priority,
    bg: "#D3D1C7",
    color: "#2C2C2A",
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative flex w-full max-w-lg flex-col rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)] max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-3 border-b border-[var(--color-border)] px-6 py-5">
          <div>
            <p className="mb-1 text-xs text-[var(--color-text-secondary)]">
              {task.project.title}
            </p>
            <h2 className="text-base font-semibold leading-snug text-[var(--color-text-primary)]">
              {task.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-[var(--radius-sm)] p-1.5 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          <div className="flex flex-wrap gap-2">
            <span
              className="rounded-full px-3 py-0.5 text-xs font-medium"
              style={{ background: status.bg, color: status.color }}
            >
              {status.label}
            </span>
            <span
              className="rounded-full px-3 py-0.5 text-xs font-medium"
              style={{ background: priority.bg, color: priority.color }}
            >
              {priority.label} priority
            </span>
            {task.dueDate && (
              <span className="rounded-full bg-[var(--color-surface-hover)] px-3 py-0.5 text-xs text-[var(--color-text-secondary)]">
                Due {formatDate(task.dueDate)}
              </span>
            )}
          </div>

          {/* Description */}
          <div>
            <p className="mb-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
              Description
            </p>
            {task.description ? (
              <p className="text-sm leading-relaxed text-[var(--color-text-primary)] whitespace-pre-wrap">
                {task.description}
              </p>
            ) : (
              <p className="text-sm italic text-[var(--color-text-secondary)]">
                No description.
              </p>
            )}
          </div>

          {/* Created / Updated */}
          <div className="grid grid-cols-2 gap-3">
            {task.createdAt && (
              <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-hover)] px-3 py-2.5">
                <p className="mb-0.5 text-xs uppercase tracking-widest text-[var(--color-text-secondary)]">
                  Created
                </p>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  {formatDate(task.createdAt)}
                </p>
              </div>
            )}
            {task.updatedAt && (
              <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-hover)] px-3 py-2.5">
                <p className="mb-0.5 text-xs uppercase tracking-widest text-[var(--color-text-secondary)]">
                  Updated
                </p>
                <p className="text-sm font-medium text-[var(--color-text-primary)]">
                  {formatDate(task.updatedAt)}
                </p>
              </div>
            )}
          </div>

          {/* Assignees — TaskUser[] → access .user for member details */}
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]">
              Assignees
            </p>
            {task.assignees.length === 0 ? (
              <p className="text-sm italic text-[var(--color-text-secondary)]">
                Unassigned
              </p>
            ) : (
              <div className="space-y-2">
                {task.assignees.map((tu) => (
                  <div key={tu.id} className="flex items-center gap-3">
                    {tu.user.avatarUrl ? (
                      <img
                        src={tu.user.avatarUrl}
                        alt={tu.user.name}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--color-primary)] text-xs font-bold text-white">
                        {getInitials(tu.user.name)}
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-[var(--color-text-primary)]">
                        {tu.user.name}
                      </p>
                      <p className="truncate text-xs text-[var(--color-text-secondary)]">
                        {tu.user.email}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-[var(--color-surface-hover)] px-2 py-0.5 text-xs text-[var(--color-text-secondary)]">
                      {tu.role === "OWNER" ? "Owner" : "Member"}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="flex justify-end gap-2 border-t border-[var(--color-border)] px-6 py-4">
          <button
            onClick={onClose}
            className="rounded-[var(--radius-md)] border border-[var(--color-border)] px-4 py-2 text-sm text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)] transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
