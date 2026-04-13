import { useEffect, useState } from "react";
import { X } from "lucide-react";
import type { ProjectListItem } from "../types";

const DESCRIPTION_MAX_LENGTH = 280;

export type ProjectFormValues = {
  title: string;
  description: string;
  dueDate: string;
};

type ProjectFormModalProps = {
  mode: "create" | "edit";
  initialProject?: ProjectListItem | null;
  submitting: boolean;
  onClose: () => void;
  onSubmit: (values: ProjectFormValues) => void;
};

function dueDateToInputValue(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function clampDescription(value: string): string {
  return value.slice(0, DESCRIPTION_MAX_LENGTH);
}

export default function ProjectFormModal({
  mode,
  initialProject,
  submitting,
  onClose,
  onSubmit,
}: ProjectFormModalProps) {
  const [title, setTitle] = useState(initialProject?.title ?? "");
  const [description, setDescription] = useState(
    clampDescription(initialProject?.description ?? ""),
  );
  const [dueDate, setDueDate] = useState(
    initialProject?.dueDate ? dueDateToInputValue(initialProject.dueDate) : "",
  );

  useEffect(() => {
    setTitle(initialProject?.title ?? "");
    setDescription(clampDescription(initialProject?.description ?? ""));
    setDueDate(
      initialProject?.dueDate
        ? dueDateToInputValue(initialProject.dueDate)
        : "",
    );
  }, [initialProject, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;
    onSubmit({
      title: title.trim(),
      description: description.trim(),
      dueDate: new Date(dueDate).toISOString(),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="relative w-full max-w-lg rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)]">
        <button
          type="button"
          disabled={submitting}
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-muted)] text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
        >
          <X size={18} />
        </button>

        <div className="border-b border-[var(--color-border)] px-6 py-5">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            {mode === "create" ? "New project" : "Edit project"}
          </h2>
          <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
            {mode === "create"
              ? "Add a title, optional description, and due date for your project."
              : "Update your project details."}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div>
            <label
              htmlFor="project-title"
              className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]"
            >
              Title
            </label>
            <input
              id="project-title"
              type="text"
              minLength={2}
              maxLength={150}
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
              placeholder="e.g. Website redesign"
            />
          </div>

          <div>
            <div className="mb-2 flex items-end justify-between gap-2">
              <label
                htmlFor="project-description"
                className="block text-sm font-medium text-[var(--color-text-secondary)]"
              >
                Description
              </label>
              <span
                className={`text-xs font-medium tabular-nums ${
                  description.length >= DESCRIPTION_MAX_LENGTH
                    ? "text-[var(--color-danger)]"
                    : "text-[var(--color-text-muted)]"
                }`}
              >
                {description.length}/{DESCRIPTION_MAX_LENGTH}
              </span>
            </div>
            <textarea
              id="project-description"
              rows={4}
              maxLength={DESCRIPTION_MAX_LENGTH}
              value={description}
              onChange={(e) => setDescription(clampDescription(e.target.value))}
              className="w-full resize-none rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
              placeholder="Brief summary of goals, scope, or context (optional)."
            />
          </div>

          <div>
            <label
              htmlFor="project-due"
              className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]"
            >
              Due date
            </label>
            <input
              id="project-due"
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2.5 text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary)]/20"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              disabled={submitting}
              onClick={onClose}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-muted)]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting || !title.trim() || !dueDate}
              className="rounded-[var(--radius-md)] bg-[var(--color-primary)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-inverse)] shadow-[var(--shadow-sm)] transition hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting
                ? "Saving…"
                : mode === "create"
                  ? "Create project"
                  : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
