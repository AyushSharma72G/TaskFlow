// TasksPage.tsx
import { useEffect, useState } from "react";
import { LayoutList, Kanban } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import TaskForm from "../components/TaskForm";
import TaskFilters from "../components/TaskFilters";
import PrimaryButton from "../../../shared/components/buttons/PrimaryButton";
import KanbanBoard from "../components/KanbanBoard";
import TaskList from "../components/TaskList";
import type { Task, TaskPriority, TaskStatus } from "../types";
import { Plus } from "lucide-react";
import {
  selectAiLoading,
  selectFilteredTasks,
  selectGeneratedDescription,
  selectProjectMembers,
  selectTaskFilters,
  selectTasksError,
  selectTasksLoading,
} from "../store/tasksSelectors";

import {
  clearGeneratedDescription,
  setPriorityFilter,
  setAssignedToFilter,
  setStatusFilter,
} from "../store/tasksSlice";

import {
  createTask,
  deleteTask,
  fetchMembers,
  fetchTasks,
  generateTaskDescription,
  updateTask,
} from "../store/tasksThunks";

type TaskFormData = {
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assigneeIds: string[];
  dueDate?: string | null;
};

const CURRENT_PROJECT_ID = "cmnrc9zzk00010vt3iyjlaybi";

export default function TasksPage() {
  const dispatch = useAppDispatch();

  const tasks = useAppSelector(selectFilteredTasks);
  const members = useAppSelector(selectProjectMembers);
  const loading = useAppSelector(selectTasksLoading);
  const error = useAppSelector(selectTasksError);
  const filters = useAppSelector(selectTaskFilters);
  const aiLoading = useAppSelector(selectAiLoading);
  const generatedDescription = useAppSelector(selectGeneratedDescription);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [view, setView] = useState<"list" | "kanban">("list");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTasks(CURRENT_PROJECT_ID));
    dispatch(fetchMembers(CURRENT_PROJECT_ID));
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearGeneratedDescription());
    };
  }, [dispatch]);

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    dispatch(clearGeneratedDescription());
    setIsTaskModalOpen(true);
  };

  const handleCloseTaskModal = () => {
    setIsTaskModalOpen(false);
    setEditingTask(null);
    dispatch(clearGeneratedDescription());
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    dispatch(clearGeneratedDescription());
    setIsTaskModalOpen(true);
  };

  const handleSubmit = async (data: TaskFormData) => {
    if (editingTask) {
      await dispatch(
        updateTask({
          taskId: editingTask.id,
          payload: {
            title: data.title,
            description: data.description,
            status: data.status,
            priority: data.priority,
            assigneeIds: data.assigneeIds,
            dueDate: data.dueDate,
          },
        }),
      );
      handleCloseTaskModal();
      return;
    }

    await dispatch(
      createTask({
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        assigneeIds: data.assigneeIds,
        dueDate: data.dueDate,
        projectId: CURRENT_PROJECT_ID || "05707d35-3fe7-4e06-a68d-a8bf65688701",
      }),
    );

    handleCloseTaskModal();
  };

  const handleGenerateDescription = (title: string) => {
    if (!title.trim()) return;
    dispatch(generateTaskDescription({ title }));
  };

  return (
    <div className="space-y-6">
      {/* Header row: title, view toggle, create button */}
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">
          Tasks
        </h1>

        <div className="flex items-center gap-3">
          {/* View toggle */}
          <div className="flex items-center rounded-[var(--radius-md)] border border-[var(--color-border)] bg-[var(--color-surface)] p-1">
            <button
              type="button"
              onClick={() => setView("list")}
              className={`flex items-center gap-1.5 rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition ${
                view === "list"
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
              }`}
            >
              <LayoutList size={15} />
              List
            </button>
            <button
              type="button"
              onClick={() => setView("kanban")}
              className={`flex items-center gap-1.5 rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition ${
                view === "kanban"
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-hover)]"
              }`}
            >
              <Kanban size={15} />
              Kanban
            </button>
          </div>

          <PrimaryButton onClick={handleOpenCreateModal} icon={<Plus />}>
            New Task
          </PrimaryButton>
        </div>
      </div>

      <TaskFilters
        filters={filters}
        users={members}
        onAssigneeChange={(value) => dispatch(setAssignedToFilter(value))}
        onStatusChange={(value) => dispatch(setStatusFilter(value))}
        onPriorityChange={(value) => dispatch(setPriorityFilter(value))}
      />

      {/* list of the task  */}
      {loading ? (
        <div className="flex items-center justify-center p-10 text-xl text-[var(--color-text-secondary)]">
          Loading tasks...
        </div>
      ) : !tasks.length ? (
        <p className="flex items-center justify-center p-10 text-xl text-[var(--color-text-secondary)]">
          No tasks found.
        </p>
      ) : view === "list" ? (
        <TaskList
          tasks={tasks}
          onEdit={handleEditTask}
          onDelete={(taskId) => dispatch(deleteTask(taskId))}
        />
      ) : (
        <KanbanBoard
          tasks={tasks}
          onEdit={handleEditTask}
          onDelete={(taskId) => dispatch(deleteTask(taskId))}
        />
      )}

      {isTaskModalOpen && (
        <TaskForm
          initialData={editingTask}
          users={members}
          loading={loading}
          aiLoading={aiLoading}
          generatedDescription={generatedDescription}
          onGenerateDescription={handleGenerateDescription}
          onClose={handleCloseTaskModal}
          onSubmit={handleSubmit}
        />
      )}
    </div>
  );
}
