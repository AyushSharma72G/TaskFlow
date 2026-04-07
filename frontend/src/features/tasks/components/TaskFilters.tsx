import type { TaskFilters as TaskFiltersType } from "../types";

interface TaskFiltersProps {
  filters: TaskFiltersType;
  onStatusChange: (value: TaskFiltersType["status"]) => void;
  onPriorityChange: (value: TaskFiltersType["priority"]) => void;
  onSearchChange: (value: string) => void;
}

export default function TaskFilters({
  filters,
  onStatusChange,
  onPriorityChange,
  onSearchChange,
}: TaskFiltersProps) {
  return (
    <div className="grid grid-cols-1 gap-4 rounded-xl border p-4 md:grid-cols-3">
      <input
        type="text"
        placeholder="Search tasks..."
        value={filters.search}
        onChange={(e) => onSearchChange(e.target.value)}
        className="rounded-md border px-3 py-2"
      />

      <select
        value={filters.status}
        onChange={(e) =>
          onStatusChange(e.target.value as TaskFiltersType["status"])
        }
        className="rounded-md border px-3 py-2"
      >
        <option value="ALL">All Status</option>
        <option value="TODO">TODO</option>
        <option value="IN_PROGRESS">IN_PROGRESS</option>
        <option value="DONE">DONE</option>
      </select>

      <select
        value={filters.priority}
        onChange={(e) =>
          onPriorityChange(e.target.value as TaskFiltersType["priority"])
        }
        className="rounded-md border px-3 py-2"
      >
        <option value="ALL">All Priority</option>
        <option value="LOW">LOW</option>
        <option value="MEDIUM">MEDIUM</option>
        <option value="HIGH">HIGH</option>
      </select>
    </div>
  );
}
