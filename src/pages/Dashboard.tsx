import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTasks, createTask, deleteTask } from "../api/tasks"; // Adjust path if needed
import { useState } from "react";

interface Task {
  id: number | string; 
  title: string;
}

const Dashboard = () => {
  const queryClient = useQueryClient();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [deletingTaskId, setDeletingTaskId] = useState<number | string | null>(null);

  const { data: tasks, isLoading: isLoadingTasks, isError: isTasksError, error: tasksError } = useQuery<Task[], Error>({
    queryKey: ["tasks"],
    queryFn: getTasks,
    staleTime: 5 * 60 * 1000, 
  });

  const createTaskMutation = useMutation<unknown, Error, string>({ 
    mutationFn: (title: string) => createTask(title),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setNewTaskTitle(""); 
      setErrorMessage(null); 
    },
    onError: (error) => {
      setErrorMessage(error.message || "Failed to create task. Please try again.");
      console.error("Create task error:", error);
    },
  });

  const deleteTaskMutation = useMutation<unknown, Error, number | string>({ // Specify types
    mutationFn: deleteTask,
    onMutate: (taskId) => {
        setDeletingTaskId(taskId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
      setErrorMessage(null);
    },
    onError: (error) => {
      setErrorMessage(error.message || "Failed to delete task. Please try again.");
      console.error("Delete task error:", error);
    },
    onSettled: () => {
        setDeletingTaskId(null);
    }
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
        setErrorMessage("Task title cannot be empty.");
        return;
    }
    setErrorMessage(null);
    createTaskMutation.mutate(newTaskTitle);
  };

  const handleDeleteTask = (taskId: number | string) => {
    setErrorMessage(null);
    deleteTaskMutation.mutate(taskId);
  };

   const isAddingTask = createTaskMutation.isLoading;

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl mx-auto">
        <h1 className="text-center text-4xl font-extrabold text-gray-900 mb-8">
          Task Dashboard
        </h1>

        {/* Add Task Form */}
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <form onSubmit={handleAddTask} className="flex items-center space-x-3">
            <label htmlFor="new-task-input" className="sr-only">
              New Task
            </label>
            <input
              id="new-task-input"
              type="text"
              value={newTaskTitle}
              onChange={(e) => {
                setNewTaskTitle(e.target.value);
                if (errorMessage) setErrorMessage(null); 
              }}
              placeholder="What needs to be done?"
              className="flex-grow px-4 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm disabled:bg-gray-50"
              disabled={isAddingTask}
            />
            <button
              type="submit"
              disabled={isAddingTask || !newTaskTitle.trim()} 
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            >
              {isAddingTask ? (
                 <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
              )}
              {isAddingTask ? "Adding..." : "Add"}
            </button>
          </form>

           {errorMessage && (
             <p className="mt-2 text-sm text-red-600">{errorMessage}</p>
           )}
        </div>

        <div className="bg-white p-6 rounded-xl shadow-lg">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Tasks</h2>
          {isLoadingTasks ? (
            <p className="text-center text-gray-500 py-4">Loading tasks...</p>
          ) : isTasksError ? (
            <p className="text-center text-red-600 py-4">Error loading tasks: {tasksError?.message || 'Unknown error'}</p>
          ) : tasks && tasks.length > 0 ? (
            <ul className="space-y-3">
              {tasks.map((task) => {
                const isDeleting = deletingTaskId === task.id;
                return (
                  <li
                    key={task.id}
                    className={`flex items-center justify-between p-4 rounded-lg border transition duration-150 ease-in-out ${isDeleting ? 'bg-red-50 border-red-200 opacity-70' : 'bg-gray-50 border-gray-200 hover:bg-gray-100'}`}
                  >
                    <span className={`text-gray-800 ${isDeleting ? 'line-through' : ''}`}>
                        {task.title}
                    </span>
                    <button
                      onClick={() => handleDeleteTask(task.id)}
                      disabled={isDeleting}
                      className="ml-4 p-1 rounded-md text-gray-400 hover:text-red-600 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
                      aria-label={`Delete task: ${task.title}`}
                    >
                      {isDeleting ? (
                        <svg className="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      )}
                    </button>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-center text-gray-500 py-4">No tasks yet. Add one above!</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;