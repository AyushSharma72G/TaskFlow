import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks"; // adjust path
import TaskForm from "../components/TaskForm";
import TaskFilters from "../components/TaskFilters";
import KanbanBoard from "../components/KanbanBoard";
import TaskList from "../components/TaskList";

import type { Task } from "../types";
import {
  selectAiLoading,
  selectFilteredTasks,
  selectGeneratedDescription,
  selectTaskFilters,
  selectTasksError,
  selectTasksLoading,
} from "../store/tasksSelectors";
import {
  clearGeneratedDescription,
  setPriorityFilter,
  setSearchFilter,
  setStatusFilter,
} from "../store/tasksSlice";
import {
  createTask,
  deleteTask,
  fetchTasks,
  generateTaskDescription,
  updateTask,
} from "../store/tasksThunks";

export default function TasksPage() {
  const dispatch = useAppDispatch();

  const tasks = useAppSelector(selectFilteredTasks);
  const loading = useAppSelector(selectTasksLoading);
  const error = useAppSelector(selectTasksError);
  const filters = useAppSelector(selectTaskFilters);
  const aiLoading = useAppSelector(selectAiLoading);
  const generatedDescription = useAppSelector(selectGeneratedDescription);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [view, setView] = useState<"list" | "kanban">("list");

  useEffect(() => {
    dispatch(fetchTasks());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearGeneratedDescription());
    };
  }, [dispatch]);

  const handleSubmit = async (data: any) => {
    if (editingTask) {
      await dispatch(
        updateTask({
          taskId: editingTask.id,
          payload: data,
        }),
      );
      setEditingTask(null);
      return;
    }

    await dispatch(createTask(data));
  };

  const handleGenerateDescription = (title: string) => {
    if (!title.trim()) return;
    dispatch(generateTaskDescription({ title }));
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setView("list")}
            className="rounded-md border px-3 py-2"
          >
            List
          </button>
          <button
            onClick={() => setView("kanban")}
            className="rounded-md border px-3 py-2"
          >
            Kanban
          </button>
        </div>
      </div>

      <TaskForm
        initialData={editingTask}
        loading={loading}
        aiLoading={aiLoading}
        generatedDescription={generatedDescription}
        onGenerateDescription={handleGenerateDescription}
        onSubmit={handleSubmit}
      />

      <TaskFilters
        filters={filters}
        onSearchChange={(value) => dispatch(setSearchFilter(value))}
        onStatusChange={(value) => dispatch(setStatusFilter(value))}
        onPriorityChange={(value) => dispatch(setPriorityFilter(value))}
      />

      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {view === "list" ? (
        <TaskList
          tasks={tasks}
          onEdit={setEditingTask}
          onDelete={(taskId) => dispatch(deleteTask(taskId))}
        />
      ) : (
        <KanbanBoard
          tasks={tasks}
          onEdit={setEditingTask}
          onDelete={(taskId) => dispatch(deleteTask(taskId))}
        />
      )}
    </div>
  );
}
