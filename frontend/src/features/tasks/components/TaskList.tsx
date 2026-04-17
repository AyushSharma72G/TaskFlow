import type { Task } from "../types";
import TaskCard from "./TaskCard";
interface TaskListProps {
  tasks: Task[];
  onEdit?: (task: Task) => void;
  onDelete?: (taskId: string) => void;
  onView?: (task: Task) => void;
}

export default function TaskList({
  tasks,
  onEdit,
  onView,
  onDelete,
}: TaskListProps) {
  return (
    <div className="grid gap-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          onView={onView}
          task={task}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}
