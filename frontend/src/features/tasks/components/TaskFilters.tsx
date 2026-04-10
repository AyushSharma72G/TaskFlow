import type { TaskFilters as TaskFiltersType, TaskUser } from "../types";

interface TaskFiltersProps {
  filters: TaskFiltersType;
  users: TaskUser[];
  onStatusChange: (value: TaskFiltersType["status"]) => void;
  onPriorityChange: (value: TaskFiltersType["priority"]) => void;
  onAssigneeChange: (value: TaskFiltersType["assigneeId"]) => void;
}

export default function TaskFilters({
  filters,
  users,
  onStatusChange,
  onPriorityChange,
  onAssigneeChange,
}: TaskFiltersProps) {
  return (
    <>
      <div className="mb-4 flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">
          Filter Tasks
        </h2>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <label
            htmlFor="assignee"
            className="text-sm font-medium text-[var(--color-text-secondary)]"
          >
            Assignee
          </label>
          <select
            id="assignee"
            value={filters.assigneeId}
            onChange={(e) =>
              onAssigneeChange(e.target.value as TaskFiltersType["assigneeId"])
            }
            className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
          >
            <option value="ALL">All Assignees</option>
            {users.map((user) => (
              <option key={user.id} value={user.id}>
                {user.user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="status"
            className="text-sm font-medium text-[var(--color-text-secondary)]"
          >
            Status
          </label>
          <select
            id="status"
            value={filters.status}
            onChange={(e) =>
              onStatusChange(e.target.value as TaskFiltersType["status"])
            }
            className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
          >
            <option value="ALL">All Status</option>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </div>

        <div className="flex flex-col gap-2">
          <label
            htmlFor="priority"
            className="text-sm font-medium text-[var(--color-text-secondary)]"
          >
            Priority
          </label>
          <select
            id="priority"
            value={filters.priority}
            onChange={(e) =>
              onPriorityChange(e.target.value as TaskFiltersType["priority"])
            }
            className="rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 text-sm text-[var(--color-text-primary)] shadow-[var(--shadow-sm)] outline-none transition focus:border-[var(--color-primary)] focus:ring-2 focus:ring-[var(--color-primary-light)]"
          >
            <option value="ALL">All Priority</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>
      </div>
    </>
  );
}
