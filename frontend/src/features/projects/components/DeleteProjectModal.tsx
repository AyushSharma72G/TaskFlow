import { X } from "lucide-react";
import type { ProjectListItem } from "../types";

type DeleteProjectModalProps = {
  project: ProjectListItem;
  submitting: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteProjectModal({
  project,
  submitting,
  onCancel,
  onConfirm,
}: DeleteProjectModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="relative w-full max-w-md rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)]">
        <button
          type="button"
          disabled={submitting}
          onClick={onCancel}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-muted)] text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-hover)]"
        >
          <X size={18} />
        </button>

        <div className="px-6 py-6">
          <h2 className="pr-10 text-lg font-semibold text-[var(--color-text-primary)]">
            Delete project?
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-text-secondary)]">
            This will permanently remove{" "}
            <span className="font-medium text-[var(--color-text-primary)]">
              {project.title}
            </span>{" "}
            and all of its tasks. This action cannot be undone.
          </p>

          <div className="mt-6 flex justify-end gap-3">
            <button
              type="button"
              disabled={submitting}
              onClick={onCancel}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-muted)]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={submitting}
              onClick={onConfirm}
              className="rounded-[var(--radius-md)] bg-[var(--color-danger)] px-4 py-2.5 text-sm font-medium text-white shadow-[var(--shadow-sm)] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Deleting…" : "Yes, delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
