import type { Task } from "../types";

interface TaskCardProps {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  return (
    <div className="rounded-xl border p-4 shadow-sm bg-white">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold">{task.title}</h3>
          <p className="mt-1 text-sm text-gray-600">{task.description}</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onEdit?.(task)}
            className="rounded-md border px-3 py-1 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete?.(task.id)}
            className="rounded-md border px-3 py-1 text-sm text-red-600"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="mt-3 flex gap-2 text-xs">
        <span className="rounded-full bg-gray-100 px-2 py-1">
          {task.status}
        </span>
        <span className="rounded-full bg-gray-100 px-2 py-1">
          {task.priority}
        </span>
        {task.dueDate && (
          <span className="rounded-full bg-gray-100 px-2 py-1">
            Due: {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
    </div>
  );
}
