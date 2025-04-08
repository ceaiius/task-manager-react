import React from 'react';
import { format, parseISO, isPast, isValid, isToday } from 'date-fns';

interface Task {
  id: number | string;
  title: string;
  status: 'pending' | 'completed';
  due_date: string | null;
  category: string | null;
}

interface TaskItemProps {
  task: Task;
  isToggling: boolean;
  isDeleting: boolean;
  onToggleStatus: (id: number | string) => void;
  onDeleteTask: (id: number | string) => void;
}

const categoryColors: { [key: string]: string } = {
    Work: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
    Personal: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
    Shopping: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
    Study: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
    Other: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
};

const TaskItem: React.FC<TaskItemProps> = ({
  task,
  isToggling,
  isDeleting,
  onToggleStatus,
  onDeleteTask,
}) => {
  const isProcessing = isToggling || isDeleting;
  const isCompleted = task.status === 'completed';

    let formattedDueDate: string | null = null;
    let isOverdue = false;
    let dateColorClass = 'text-gray-500 dark:text-gray-400';
    if (task.due_date) { 
        try {
          const dueDate = parseISO(task.due_date);
          if (isValid(dueDate)) {
             formattedDueDate = format(dueDate, 'MMM d, yyyy');
             if (!isCompleted && isPast(dueDate) && !isToday(dueDate)) {
                 isOverdue = true;
                 dateColorClass = 'text-red-600 dark:text-red-400 font-medium';
             } else if (isToday(dueDate) && !isCompleted) {
                dateColorClass = 'text-yellow-600 dark:text-yellow-400 font-medium';
             }
          } else { formattedDueDate = 'Invalid Date'; dateColorClass = 'text-red-600 dark:text-red-400';}
        } catch (error) { formattedDueDate = 'Error'; dateColorClass = 'text-red-600 dark:text-red-400'; }
    }
  
   const categoryColor = task.category ? categoryColors[task.category] || categoryColors['Other'] : '';


  return (

    <li
      className={`flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 rounded-lg border transition duration-150 ease-in-out ${
          isDeleting ? 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-700 opacity-50'
        : isToggling ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-700 opacity-70'
        : isCompleted ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-700'
        : 'bg-gray-50 dark:bg-gray-800/80 border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700/90'
      }`}
    >
        <div className="line-clamp-1 mb-2 sm:mb-0 flex flex-wrap flex-grow mr-4">

            <span className={` break-words text-ellipsis overflow-hidden block text-gray-800 dark:text-gray-100 ${isCompleted && !isDeleting ? 'line-through text-gray-500 dark:text-gray-400' : ''} ${isProcessing ? 'opacity-70' : ''}`}>
                {task.title}
            </span>
            <div className="flex items-center flex-wrap gap-x-3 mt-1">

                {formattedDueDate && (
                    <p className={`text-xs ${dateColorClass} ${isProcessing ? 'opacity-70' : ''}`}>
                        Due: {formattedDueDate} {isOverdue ? '(Overdue)' : ''}
                    </p>
                )}
                 {task.category && (
                     <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${categoryColor} ${isProcessing ? 'opacity-70' : ''}`}>
                         {task.category}
                     </span>
                 )}
            </div>
        </div>


      <div className="flex items-center space-x-2 flex-shrink-0 mt-2 sm:mt-0">
          <button onClick={() => onToggleStatus(task.id)} disabled={isProcessing} className={`p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ${isToggling?'text-yellow-600':''} ${isCompleted ?'text-yellow-500 hover:bg-yellow-100 dark:hover:bg-yellow-900/30 hover:text-yellow-700 focus:ring-yellow-500':'text-green-500 hover:bg-green-100 dark:hover:bg-green-900/30 hover:text-green-700 focus:ring-green-500'}`} aria-label={isCompleted?`Mark task "${task.title}" as pending`:`Mark task "${task.title}" as completed`}>
            {isToggling? <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"> <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : isCompleted ? <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.5 8.5A5.5 5.5 0 1113 14M13 14V9.5" /></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>}
          </button>
          <button onClick={() => onDeleteTask(task.id)} disabled={isProcessing} className={`p-1 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-1 dark:focus:ring-offset-gray-800 transition duration-150 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed ${isDeleting?'text-red-600':'text-gray-400 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 focus:ring-red-500'}`} aria-label={`Delete task: ${task.title}`}>
             {isDeleting? <svg className="animate-spin h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>}
          </button>
      </div>
    </li>
  );
};

export default TaskItem;