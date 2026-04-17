import { useEffect, useMemo, useState } from "react";
import type { Task, TaskStatus } from "../types";
import TaskCard from "./TaskCard";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  closestCorners,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragOverEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface KanbanBoardProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onStatusChange?: (taskId: string, status: TaskStatus) => void;
  onView?: (task: Task) => void;
}

const columns: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

function getColumnTitle(status: TaskStatus) {
  if (status === "IN_PROGRESS") return "In Progress";
  if (status === "TODO") return "To Do";
  return "Done";
}

function TaskSortableCard({
  task,
  onEdit,
  onDelete,
  onView,
}: {
  task: Task;
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onView?: (task: Task) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: "task",
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <TaskCard
        task={task}
        onEdit={onEdit}
        onDelete={onDelete}
        onView={onView}
      />
    </div>
  );
}

function KanbanColumn({
  status,
  tasks,
  onEdit,
  onView,
  onDelete,
}: {
  status: TaskStatus;
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onView?: (task: Task) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
    data: {
      type: "column",
      status,
    },
  });

  return (
    <div
      ref={setNodeRef}
      className={`rounded-xl border bg-[var(--color-surface)] p-4 transition ${
        isOver
          ? "border-blue-400 ring-2 ring-blue-200"
          : "border-[var(--color-border)]"
      }`}
    >
      <h2 className="mb-4 text-lg font-semibold text-[var(--color-text-primary)]">
        {getColumnTitle(status)}
      </h2>

      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={rectSortingStrategy}
      >
        <div className="min-h-[120px] space-y-4">
          {tasks.length ? (
            tasks.map((task) => (
              <TaskSortableCard
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                onView={onView}
              />
            ))
          ) : (
            <p className="text-sm text-[var(--color-text-secondary)]">
              No tasks
            </p>
          )}
        </div>
      </SortableContext>
    </div>
  );
}

export default function KanbanBoard({
  tasks,
  onEdit,
  onDelete,
  onView,
  onStatusChange,
}: KanbanBoardProps) {
  const [localTasks, setLocalTasks] = useState<Task[]>(tasks);
  const [activeTask, setActiveTask] = useState<Task | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    if (!isDragging) {
      setLocalTasks(tasks);
    }
  }, [tasks, isDragging]);
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    }),
  );

  const tasksByColumn = useMemo(() => {
    return {
      TODO: localTasks.filter((task) => task.status === "TODO"),
      IN_PROGRESS: localTasks.filter((task) => task.status === "IN_PROGRESS"),
      DONE: localTasks.filter((task) => task.status === "DONE"),
    };
  }, [localTasks]);

  const findTaskById = (taskId: string) => {
    return localTasks.find((task) => task.id === taskId) ?? null;
  };

  const getTaskStatus = (taskId: string): TaskStatus | null => {
    const task = findTaskById(taskId);
    return task?.status ?? null;
  };

  const moveTaskToStatus = (taskId: string, newStatus: TaskStatus) => {
    setLocalTasks((prev) =>
      prev.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task,
      ),
    );
  };

  const handleDragCancel = () => {
    setIsDragging(false);
    setActiveTask(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setIsDragging(true);

    const taskId = String(event.active.id);
    const task = findTaskById(taskId);
    setActiveTask(task);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;

    if (!over) return;

    const activeTaskId = String(active.id);
    const overId = String(over.id);

    const activeStatus = getTaskStatus(activeTaskId);
    if (!activeStatus) return;

    let nextStatus: TaskStatus | null = null;

    // dropped over a column
    if (columns.includes(overId as TaskStatus)) {
      nextStatus = overId as TaskStatus;
    } else {
      // dropped over another task
      nextStatus = getTaskStatus(overId);
    }

    if (!nextStatus || nextStatus === activeStatus) return;

    moveTaskToStatus(activeTaskId, nextStatus);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setIsDragging(false);
    setActiveTask(null);

    if (!over) return;

    const activeTaskId = String(active.id);
    const updatedTask = findTaskById(activeTaskId);
    if (!updatedTask) return;

    onStatusChange?.(activeTaskId, updatedTask.status);
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {columns.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            tasks={tasksByColumn[status]}
            onView={onView}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="rotate-1 opacity-95">
            <TaskCard task={activeTask} onEdit={onEdit} onDelete={onDelete} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}
