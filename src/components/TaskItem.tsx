
import React from 'react';
import { Check } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  completedBy: string | null;
  completedAt: string | null;
}

interface TaskItemProps {
  task: Task;
  onToggle: () => void;
}

export const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle }) => {
  const formatTime = (timestamp: string | null) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div
      onClick={onToggle}
      className={`flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer active:scale-95 ${
        task.completed
          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
          : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600 hover:border-blue-300 dark:hover:border-blue-500'
      }`}
    >
      <div className="flex items-center space-x-3 flex-1">
        <div
          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            task.completed
              ? 'bg-green-500 border-green-500'
              : 'border-slate-300 dark:border-slate-500 hover:border-blue-400'
          }`}
        >
          {task.completed && <Check className="w-4 h-4 text-white" />}
        </div>
        <div className="flex-1">
          <span
            className={`text-base transition-all duration-200 ${
              task.completed
                ? 'text-green-700 dark:text-green-300 line-through'
                : 'text-slate-800 dark:text-slate-200'
            }`}
          >
            {task.text}
          </span>
          {task.completed && task.completedBy && (
            <div className="text-xs text-green-600 dark:text-green-400 mt-1">
              Completed by {task.completedBy} at {formatTime(task.completedAt)}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
