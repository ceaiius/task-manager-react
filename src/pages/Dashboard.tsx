import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, createTask, deleteTask, toggleTaskStatus } from "../api/tasks"; // Adjust path if needed
import { useState } from "react";
import AddTaskForm from '../components/AddTaskForm';
import TaskList from '../components/TaskList';

interface Task {
  id: number | string;
  title: string;
  status: 'pending' | 'completed';
  due_date: string | null; 
}

interface AddTaskPayload {
    title: string;
    dueDate: string | null;
}

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [togglingTaskId, setTogglingTaskId] = useState<number | string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<number | string | null>(null);

  const { data: tasks, isLoading: isLoadingTasks, isError: isTasksError, error: tasksError } = useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: getTasks,
    staleTime: 1 * 60 * 1000,
  });

  const createTaskMutation = useMutation<unknown, Error, AddTaskPayload>({
    mutationFn: (payload) => createTask({ title: payload.title, due_date: payload.dueDate }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setErrorMessage(null);
    },
    onError: (error) => {
      setErrorMessage(error.message || "Failed to create task. Please try again.");
      console.error("Create task error:", error);
    },
  });


  const toggleTaskStatusMutation = useMutation<unknown, Error, number | string>({
      mutationFn: toggleTaskStatus,
       onMutate: (taskId) => { setTogglingTaskId(taskId); setErrorMessage(null); },
       onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["tasks"] }); },
       onError: (error, taskId) => { setErrorMessage(error.message || "Failed to update status."); console.error(`Toggle status error for task ${taskId}:`, error); },
       onSettled: () => { setTogglingTaskId(null); },
  });

  const deleteTaskMutation = useMutation<unknown, Error, number | string>({ 
      mutationFn: deleteTask,
       onMutate: (taskId) => { setDeletingTaskId(taskId); setErrorMessage(null); },
       onSuccess: () => { queryClient.invalidateQueries({ queryKey: ["tasks"] }); },
       onError: (error, taskId) => { setErrorMessage(error.message || "Failed to delete task."); console.error(`Delete task error for task ${taskId}:`, error); },
       onSettled: () => { setDeletingTaskId(null); },
  });


  const handleCreateTaskSubmit = (payload: AddTaskPayload) => {
    setErrorMessage(null);
    console.log("Dashboard received payload:", payload);
    createTaskMutation.mutate(payload); 
  };

  const handleToggleStatus = (taskId: number | string) => {
    setErrorMessage(null);
    toggleTaskStatusMutation.mutate(taskId);
  }

  const handleDeleteTask = (taskId: number | string) => {
    setErrorMessage(null);
    deleteTaskMutation.mutate(taskId);
  };

  const handleClearError = () => {
    setErrorMessage(null);
  }


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-center text-4xl font-extrabold text-gray-900 dark:text-gray-100 mb-8">
          Task Dashboard
        </h1>

        <AddTaskForm
            onSubmit={handleCreateTaskSubmit}
            isLoading={createTaskMutation.isLoading}
            onClearError={handleClearError}
         />

         {errorMessage && (
             <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 rounded-md" role="alert">
                 {errorMessage}
             </div>
         )}

        <TaskList
            tasks={tasks}
            isLoading={isLoadingTasks}
            isError={isTasksError}
            error={tasksError}
            togglingTaskId={togglingTaskId}
            deletingTaskId={deletingTaskId}
            onToggleStatus={handleToggleStatus}
            onDeleteTask={handleDeleteTask}
         />

      </div>
    </div>
  );
};

export default Dashboard;