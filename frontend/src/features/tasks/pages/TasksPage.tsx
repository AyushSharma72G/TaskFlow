import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { LayoutList, Kanban, Plus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../../../store/hooks";
import TaskForm from "../components/TaskForm";
import TaskFilters from "../components/TaskFilters";
import PrimaryButton from "../../../shared/components/buttons/PrimaryButton";
import KanbanBoard from "../components/KanbanBoard";
import TaskList from "../components/TaskList";
import Loader from "../../../shared/components/Loader";

import type {
  Task,
  TaskFilters as TaskFiltersType,
  TaskPriority,
  TaskStatus,
} from "../types";
import {
  selectAiLoading,
  selectFilteredTasks,
  selectGeneratedDescription,
  selectProjectMembers,
  selectTaskFilters,  
  selectTasksError,
  selectTasksLoading,
  selectNextCursor,
  selectHasNextPage,
  selectLoadingMore,
} from "../store/tasksSelectors";
import {
  clearGeneratedDescription,
  clearTasksError,
  setPriorityFilter,
  setAssignedToFilter,
  setTaskStatusOptimistic,
  revertTaskStatus,
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

export default function TasksPage() {
  const { id: projectId } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();

  const tasks = useAppSelector(selectFilteredTasks);
  const members = useAppSelector(selectProjectMembers);
  const loading = useAppSelector(selectTasksLoading);
  const error = useAppSelector(selectTasksError);
  const filters = useAppSelector(selectTaskFilters);
  const aiLoading = useAppSelector(selectAiLoading);
  const generatedDescription = useAppSelector(selectGeneratedDescription);
  const nextCursor = useAppSelector(selectNextCursor);
  const hasNextPage = useAppSelector(selectHasNextPage);
  const loadingMore = useAppSelector(selectLoadingMore);

  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [view, setView] = useState<"list" | "kanban">("list");
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  // Initial fetch
  useEffect(() => {
    if (!projectId) return;
    dispatch(fetchTasks({ projectId }));
    dispatch(fetchMembers(projectId));
  }, [dispatch, projectId]);

  // Cleanup generated description on unmount
  useEffect(() => {
    return () => {
      dispatch(clearGeneratedDescription());
    };
  }, [dispatch]);

  // Auto-clear error after 6s
  useEffect(() => {
    if (!error) return;
    const t = window.setTimeout(() => dispatch(clearTasksError()), 6000);
    return () => window.clearTimeout(t);
  }, [error, dispatch]);

  const handleLoadMore = () => {
    if (!projectId || !hasNextPage || loadingMore) return;
    dispatch(fetchTasks({ projectId, cursor: nextCursor ?? undefined }));
  };

  const handleStatusChange = (value: TaskFiltersType["status"]) => {
    dispatch(setStatusFilter(value));
  };

  const handlePriorityChange = (value: TaskFiltersType["priority"]) => {
    dispatch(setPriorityFilter(value));
  };

  const handleAssigneeChange = (value: TaskFiltersType["assigneeId"]) => {
    dispatch(setAssignedToFilter(value));
  };

  // Modal handlers
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

    if (!projectId) return;
    await dispatch(
      createTask({
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        assigneeIds: data.assigneeIds,
        dueDate: data.dueDate,
        projectId,
      }),
    );
    handleCloseTaskModal();
  };

  const handleGenerateDescription = (title: string, projectId: string) => {
    if (!title.trim()) return;
    dispatch(generateTaskDescription({ title, projectId }));
  };

  const handleKanbanStatusChange = (taskId: string, status: TaskStatus) => {
    const previousTask = tasks.find((t) => t.id === taskId);
    if (!previousTask) return;

    dispatch(setTaskStatusOptimistic({ taskId, status }));

    dispatch(updateTask({ taskId, payload: { status } }))
      .unwrap()
      .catch(() => {
        dispatch(
          revertTaskStatus({
            taskId,
            previousStatus: previousTask.status,
          }),
        );
      });
  };

  if (!projectId) {
    return (
      <div className="rounded-[var(--radius-xl)] border border-[var(--color-border)] bg-[var(--color-surface)] p-8 text-center text-[var(--color-text-secondary)] shadow-[var(--shadow-sm)]">
        Open a project from the Projects page to view tasks.
      </div>
    );
  }

  return (
    <div className="h-screen">
      <div className="space-y-6">
        {/* Header */}
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

        {/* Filters */}
        <TaskFilters
          filters={filters}
          users={members}
          onAssigneeChange={handleAssigneeChange}
          onStatusChange={handleStatusChange}
          onPriorityChange={handlePriorityChange}
        />

        {/* Error banner */}
        {error ? (
          <div
            className="rounded-[var(--radius-md)] border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800"
            role="alert"
          >
            {error}
          </div>
        ) : null}

        {/* Task list / kanban */}
        {loading ? (
          <div className="flex items-center justify-center p-10 text-xl text-[var(--color-text-secondary)]">
            <Loader />
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
            onStatusChange={handleKanbanStatusChange}
          />
        )}

        {/* Load more button */}
        {hasNextPage && !loading && (
          <div className="flex justify-center py-4">
            <PrimaryButton onClick={handleLoadMore} disabled={loadingMore}>
              {loadingMore ? "Loading..." : "Load More"}
            </PrimaryButton>
          </div>
        )}

        {/* End of list indicator */}
        {!hasNextPage && tasks.length > 0 && !loading && (
          <p className="py-4 text-center text-sm text-[var(--color-text-secondary)]">
            All tasks loaded
          </p>
        )}

        {/* Task form modal */}
        {isTaskModalOpen && (
          <TaskForm
            initialData={editingTask}
            users={members}
            projectId={projectId}
            loading={loading}
            aiLoading={aiLoading}
            generatedDescription={generatedDescription}
            onGenerateDescription={handleGenerateDescription}
            onClose={handleCloseTaskModal}
            onSubmit={handleSubmit}
          />
        )}
      </div>
    </div>
  );
}
