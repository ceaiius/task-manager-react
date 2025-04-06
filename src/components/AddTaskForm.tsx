import React, { useState } from 'react';

interface AddTaskPayload {
    title: string;
    dueDate: string | null;
}

interface AddTaskFormProps {
  onSubmit: (payload: AddTaskPayload) => void;
  isLoading: boolean;
  onClearError?: () => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({ onSubmit, isLoading, onClearError }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [dueDate, setDueDate] = useState<string>("");
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) {
        setValidationError("Task title cannot be empty.");
        return;
    }
    setValidationError(null);
    onClearError?.();
    onSubmit({ title: newTaskTitle, dueDate: dueDate || null });
    setNewTaskTitle("");
    setDueDate("");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewTaskTitle(e.target.value);
    if (validationError) setValidationError(null);
    onClearError?.();
  }

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDueDate(e.target.value);
     if (validationError) setValidationError(null);
     onClearError?.();
  }

  return (
     <div className="bg-white dark:bg-gray-800 border dark:border-gray-700 p-6 rounded-xl shadow-lg mb-8">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 items-end">
            <div className="md:col-span-1">
                 <label htmlFor="new-task-input" className="sr-only">
                    New Task Title
                 </label>
                 <input
                    id="new-task-input"
                    type="text"
                    value={newTaskTitle}
                    onChange={handleInputChange}
                    placeholder="What needs to be done?"
                    className={`w-full px-4 py-2 border rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-offset-gray-800 sm:text-sm disabled:opacity-50 ${validationError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'}`}
                    disabled={isLoading}
                />
            </div>

             <div className="md:col-span-1">
                <label htmlFor="due-date-input" className="sr-only">
                    Due Date (Optional)
                </label>
                <input
                    id="due-date-input"
                    type="date"
                    value={dueDate}
                    onChange={handleDateChange}
                    className={`w-full px-4 py-2 border rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-400 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 dark:focus:ring-offset-gray-800 sm:text-sm disabled:opacity-50 border-gray-300 dark:border-gray-600`}
                    disabled={isLoading}
                />
            </div>
            <button
                type="submit"
                disabled={isLoading || !newTaskTitle.trim()}

                className="md:col-span-1 inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-default-red hover:bg-black focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-800 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out"
            >
                {isLoading ? (
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" /></svg>
                )}
                {isLoading ? "Adding..." : "Add"}
            </button>
        </form>
        {validationError && (
            <p className="mt-2 text-sm text-red-600 dark:text-red-400">{validationError}</p>
        )}
    </div>
  );
};

export default AddTaskForm;