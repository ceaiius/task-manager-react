import React from 'react';
import TaskItem from './TaskItem'; 

interface Task {
  id: number | string;
  title: string;
  status: 'pending' | 'completed';
}

interface TaskListProps {
  tasks: Task[] | undefined;
  isLoading: boolean;
  isError: boolean;
  error: Error | null;
  togglingTaskId: number | string | null;
  deletingTaskId: number | string | null;
  onToggleStatus: (id: number | string) => void;
  onDeleteTask: (id: number | string) => void;
}

const TaskList: React.FC<TaskListProps> = ({
  tasks,
  isLoading,
  isError,
  error,
  togglingTaskId,
  deletingTaskId,
  onToggleStatus,
  onDeleteTask,
}) => {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Tasks</h2>
      {isLoading ? (
        <p className="text-center text-gray-500 py-4">Loading tasks...</p>
      ) : isError ? (
        <p className="text-center text-red-600 py-4">Error loading tasks: {error?.message || 'Unknown error'}</p>
      ) : tasks && tasks.length > 0 ? (
        <ul className="space-y-3">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              isToggling={togglingTaskId === task.id}
              isDeleting={deletingTaskId === task.id}
              onToggleStatus={onToggleStatus}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 py-4">No tasks yet. Add one above!</p>
      )}
    </div>
  );
};

export default TaskList;