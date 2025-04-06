import React, { useMemo } from 'react'; 
import TaskItem from './TaskItem';
import { parseISO, compareAsc, isValid } from 'date-fns';

interface Task {
  id: number | string;
  title: string;
  status: 'pending' | 'completed';
  due_date: string | null; 
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
  const sortedTasks = useMemo(() => {
    if (!tasks) return [];

    return [...tasks].sort((a, b) => {
        const dateA = a.due_date ? parseISO(a.due_date) : null;
        const dateB = b.due_date ? parseISO(b.due_date) : null;
        const isValidA = dateA && isValid(dateA);
        const isValidB = dateB && isValid(dateB);

        if (isValidA && !isValidB) return -1;
        if (!isValidA && isValidB) return 1;


        if (isValidA && isValidB) {
            const comparison = compareAsc(dateA, dateB);
            if (comparison !== 0) return comparison;
        }

        return 0; 
    });
  }, [tasks]); 

  return (
    <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-6 rounded-xl shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Your Tasks</h2>
      {isLoading ? (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">Loading tasks...</p>
      ) : isError ? (
        <p className="text-center text-red-600 dark:text-red-400 py-4">Error loading tasks: {error?.message || 'Unknown error'}</p>
      ) : sortedTasks && sortedTasks.length > 0 ? ( 
        <ul className="space-y-3">
          {sortedTasks.map((task) => (
            <TaskItem
              key={task.id}
              task={task} // Pass the task object which now includes due_date
              isToggling={togglingTaskId === task.id}
              isDeleting={deletingTaskId === task.id}
              onToggleStatus={onToggleStatus}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </ul>
      ) : (
        <p className="text-center text-gray-500 dark:text-gray-400 py-4">No tasks yet. Add one above!</p>
      )}
    </div>
  );
};

export default TaskList;