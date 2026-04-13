import { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import type { Task, TaskPriority, TaskStatus, TaskUser } from "../types";
import GenerateDescriptionButton from "./GenerateDescriptionButton";
import { X } from "lucide-react";

interface TaskFormProps {
  initialData?: Task | null;
  projectId: string;
  users: TaskUser[];
  loading?: boolean;
  aiLoading?: boolean;
  generatedDescription?: string;
  onGenerateDescription?: (title: string, projectId: string) => void;
  onClose: () => void;
  onSubmit: (data: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    assigneeIds: string[];
    dueDate?: string | null;
  }) => void;
}

type AssigneeOption = {
  value: string;
  label: string;
};

export default function TaskForm({
  initialData,
  projectId,
  users,
  loading,
  aiLoading,
  generatedDescription,
  onGenerateDescription,
  onClose,
  onSubmit,
}: TaskFormProps) {
  const getTaskAssigneeIds = (task?: Task | null): string[] => {
    if (!task?.assignees?.length) return [];

    return task.assignees
      .map((assignee: any) => assignee.userId ?? assignee.user?.id ?? "")
      .filter((id: string) => typeof id === "string" && id.trim() !== "");
  };

  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(
    initialData?.description || "",
  );
  const [status, setStatus] = useState<TaskStatus>(
    initialData?.status || "TODO",
  );
  const [priority, setPriority] = useState<TaskPriority>(
    initialData?.priority || "MEDIUM",
  );
  const [dueDate, setDueDate] = useState(initialData?.dueDate || "");
  const [assigneeIds, setAssigneeIds] = useState<string[]>(
    getTaskAssigneeIds(initialData),
  );

  useEffect(() => {
    if (generatedDescription) {
      setDescription(generatedDescription);
    }
  }, [generatedDescription]);

  useEffect(() => {
    setTitle(initialData?.title || "");
    setDescription(initialData?.description || "");
    setStatus(initialData?.status || "TODO");
    setPriority(initialData?.priority || "MEDIUM");
    setDueDate(initialData?.dueDate || "");
    setAssigneeIds(getTaskAssigneeIds(initialData));
  }, [initialData]);

  const assigneeOptions = useMemo<AssigneeOption[]>(
    () =>
      users.map((member: any) => ({
        value: member.userId ?? member.user?.id ?? "",
        label: `${member.user?.name ?? "Unknown"} (${member.user?.email ?? "No email"})`,
      })),
    [users],
  );

  const selectedAssignees = useMemo(() => {
    return assigneeOptions.filter((option) =>
      assigneeIds.includes(option.value),
    );
  }, [assigneeOptions, assigneeIds]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cleanedAssigneeIds = assigneeIds.filter(
      (id): id is string => typeof id === "string" && id.trim() !== "",
    );

    onSubmit({
      title,
      description,
      status,
      priority,
      assigneeIds: cleanedAssigneeIds,
      dueDate: dueDate || null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="relative w-full max-w-2xl rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] shadow-[var(--shadow-lg)]">
        <button
          type="button"
          disabled={loading}
          onClick={onClose}
          className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-muted)] text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-hover)] hover:text-[var(--color-text-primary)]"
        >
          <X size={18} />
        </button>

        <div className="border-b border-[var(--color-border)] px-6 py-5">
          <h2 className="text-xl font-semibold text-[var(--color-text-primary)]">
            {initialData ? "Update Task" : "Create New Task"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 px-6 py-6">
          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
              Title
            </label>
            <input
              type="text"
              className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-blue-100"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter task title"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
              Description
            </label>
            <textarea
              className="min-h-[120px] w-full resize-none rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:ring-2 focus:ring-blue-100"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter task description"
            />
          </div>

          <GenerateDescriptionButton
            loading={aiLoading}
            onClick={() => onGenerateDescription?.(title, projectId)}
          />

          <div>
            <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
              Assignees
            </label>

            <Select<AssigneeOption, true>
              isMulti
              options={assigneeOptions}
              value={selectedAssignees}
              onChange={(selectedOptions) =>
                setAssigneeIds(selectedOptions.map((option) => option.value))
              }
              placeholder="Select assignees..."
              classNamePrefix="react-select"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
                Status
              </label>
              <select
                className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-blue-100"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
              >
                <option value="TODO">TODO</option>
                <option value="IN_PROGRESS">IN PROGRESS</option>
                <option value="DONE">DONE</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
                Priority
              </label>
              <select
                className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-blue-100"
                value={priority}
                onChange={(e) => setPriority(e.target.value as TaskPriority)}
              >
                <option value="LOW">LOW</option>
                <option value="MEDIUM">MEDIUM</option>
                <option value="HIGH">HIGH</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-[var(--color-text-secondary)]">
                Due Date
              </label>
              <input
                min={new Date().toISOString().split("T")[0]}
                type="date"
                className="w-full rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-sm text-[var(--color-text-primary)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-blue-100"
                value={dueDate ? dueDate.slice(0, 10) : ""}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-[var(--color-border)] pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm font-medium text-[var(--color-text-secondary)] transition hover:bg-[var(--color-surface-hover)]"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={loading}
              className="rounded-[var(--radius-md)] bg-[var(--color-primary)] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[var(--color-primary-dark)] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Saving..."
                : initialData
                  ? "Update Task"
                  : "Create Task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
