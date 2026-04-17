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

  const statusConfig: Record<
    Task["status"],
    { label: string; className: string; dot: string }
  > = {
    TODO: {
      label: "Todo",
      className: "bg-stone-100 text-stone-600 border-stone-200",
      dot: "bg-stone-400",
    },
    IN_PROGRESS: {
      label: "In Progress",
      className: "bg-blue-50 text-blue-700 border-blue-200",
      dot: "bg-blue-500",
    },
    DONE: {
      label: "Done",
      className: "bg-green-50 text-green-700 border-green-200",
      dot: "bg-green-500",
    },
  };

  const priorityConfig: Record<
    Task["priority"],
    { label: string; className: string }
  > = {
    LOW: {
      label: "Low priority",
      className: "bg-green-50 text-green-700 border-green-200",
    },
    MEDIUM: {
      label: "Medium priority",
      className: "bg-amber-50 text-amber-700 border-amber-200",
    },
    HIGH: {
      label: "High priority",
      className: "bg-red-50 text-red-700 border-red-200",
    },
  };

  const assigneeNames =
    task.assignees.length > 0
      ? task.assignees.map((a) => a?.user?.name).join(", ")
      : "Unassigned";

  const handleDeleteConfirm = () => {
    onDelete?.(task.id);
    setShowDeleteModal(false);
  };

  const {
    label: statusLabel,
    className: statusClass,
    dot: dotClass,
  } = statusConfig[task.status];
  const { label: priorityLabel, className: priorityClass } =
    priorityConfig[task.priority];

  return (
    <>
      <div className="bg-white border border-gray-200 rounded-2xl p-5 transition-colors hover:border-gray-300">
        <div className="flex items-start justify-between gap-4 ">
          <div className="flex flex-col gap-2 min-w-0 w-full">
            <div className="flex flex-wrap justify-between items-center gap-2 mb-2 ">
              {/* labels */}
              <div className="flex flex-wrap gap-2">
                {" "}
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border ${statusClass}`}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${dotClass}`} />
                  {statusLabel}
                </span>
                <span
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${priorityClass}`}
                >
                  {priorityLabel}
                </span>
              </div>

              {/* edit and delete buttons  */}
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => onEdit?.(task)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 border border-gray-200 bg-white hover:bg-gray-50 hover:text-gray-900 transition-colors"
                >
                  <Pencil size={12} />
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => setShowDeleteModal(true)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={12} />
                  Delete
                </button>
              </div>
            </div>

            <h3 className="text-md font-semibold text-gray-900 leading-snug ">
              {task.title}
            </h3>

            {task.description ? (
              <p className=" text-md text-gray-500 leading-relaxed line-clamp-2">
                {task.description.slice(0, 200)}
                {task.description.length > 200 ? " . . ." : ""}
              </p>
            ) : (
              <p className="text-md text-gray-500 leading-relaxed line-clamp-2">
                No Description Provided
              </p>
            )}
          </div>

          {/* Right: action buttons */}
          <div className="flex items-center gap-2 shrink-0"></div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-4" />

        {/* Footer: assignees + due date */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-gray-500 border border-gray-200 bg-gray-50">
            <User size={12} />
            {assigneeNames}
          </span>

          {task.dueDate && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium text-gray-500 border border-gray-200 bg-gray-50">
              <CalendarDays size={12} />
              Due{" "}
              {new Date(task.dueDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
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
