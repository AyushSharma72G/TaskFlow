import { useEffect, useState } from "react";
import type { Task, TaskPriority, TaskStatus } from "../types";
import GenerateDescriptionButton from "./GenerateDescriptionButton";

interface TaskFormProps {
  initialData?: Task | null;
  loading?: boolean;
  aiLoading?: boolean;
  generatedDescription?: string;
  onGenerateDescription?: (title: string) => void;
  onSubmit: (data: {
    title: string;
    description: string;
    status: TaskStatus;
    priority: TaskPriority;
    dueDate?: string | null;
  }) => void;
}

export default function TaskForm({
  initialData,
  loading,
  aiLoading,
  generatedDescription,
  onGenerateDescription,
  onSubmit,
}: TaskFormProps) {
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

  useEffect(() => {
    if (generatedDescription) {
      setDescription(generatedDescription);
    }
  }, [generatedDescription]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    onSubmit({
      title,
      description,
      status,
      priority,
      dueDate: dueDate || null,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border p-4">
      <div>
        <label className="mb-1 block text-sm font-medium">Title</label>
        <input
          type="text"
          className="w-full rounded-md border px-3 py-2"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Description</label>
        <textarea
          className="w-full rounded-md border px-3 py-2"
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter task description"
        />
      </div>

      <GenerateDescriptionButton
        loading={aiLoading}
        onClick={() => onGenerateDescription?.(title)}
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div>
          <label className="mb-1 block text-sm font-medium">Status</label>
          <select
            className="w-full rounded-md border px-3 py-2"
            value={status}
            onChange={(e) => setStatus(e.target.value as TaskStatus)}
          >
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="DONE">DONE</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Priority</label>
          <select
            className="w-full rounded-md border px-3 py-2"
            value={priority}
            onChange={(e) => setPriority(e.target.value as TaskPriority)}
          >
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
          </select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Due Date</label>
          <input
            type="date"
            className="w-full rounded-md border px-3 py-2"
            value={dueDate ? dueDate.slice(0, 10) : ""}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="rounded-md bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
      >
        {loading ? "Saving..." : initialData ? "Update Task" : "Create Task"}
      </button>
    </form>
  );
}
