import PrimaryButton from "../../../shared/components/buttons/PrimaryButton";
import { Trash } from "lucide-react";

interface DeleteTaskProps {
  taskId: string;
  onCancel?: () => void;
  onDelete?: (taskId: string) => void;
}

export const DeleteModal = ({
  taskId,
  onDelete,
  onCancel,
}: DeleteTaskProps) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6">
      <div className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl">
        {/* Header */}
        <h2 className="text-lg font-semibold text-gray-900">Delete Task</h2>

        <p className="mt-2 text-sm text-gray-600">
          Are you sure you want to delete this task? This action cannot be
          undone.
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
          >
            Cancel
          </button>

          <PrimaryButton
            icon={<Trash size={16} />}
            onClick={() => onDelete?.(taskId)}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};
