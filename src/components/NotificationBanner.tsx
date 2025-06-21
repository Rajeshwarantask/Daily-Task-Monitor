
import React from 'react';
import { AlertTriangle, CheckCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  completedBy: string | null;
  completedAt: string | null;
}

interface NotificationBannerProps {
  isActive: boolean;
  type: 'morning' | 'evening' | null;
  tasks: Task[];
  onDismiss: () => boolean;
  isDarkMode: boolean;
}

export const NotificationBanner: React.FC<NotificationBannerProps> = ({
  isActive,
  type,
  tasks,
  onDismiss,
  isDarkMode
}) => {
  if (!isActive || !type) return null;

  const incompleteTasks = tasks.filter(task => !task.completed);
  const allCompleted = incompleteTasks.length === 0;

  const handleDismiss = () => {
    const success = onDismiss();
    if (!success && !allCompleted) {
      // Show feedback that dismissal failed
      alert('Please complete all tasks before dismissing this reminder.');
    }
  };

  return (
    <div className={`fixed top-16 left-0 right-0 z-50 mx-4 rounded-lg shadow-lg border-2 transition-all duration-300 ${
      allCompleted 
        ? 'bg-green-50 dark:bg-green-900/20 border-green-500' 
        : 'bg-red-50 dark:bg-red-900/20 border-red-500'
    }`}>
      <div className="p-4">
        <div className="flex items-start space-x-3">
          <div className={`p-1 rounded-full ${
            allCompleted ? 'bg-green-500' : 'bg-red-500'
          }`}>
            {allCompleted ? (
              <CheckCircle className="w-5 h-5 text-white" />
            ) : (
              <AlertTriangle className="w-5 h-5 text-white" />
            )}
          </div>
          
          <div className="flex-1">
            <h3 className={`font-semibold ${
              allCompleted 
                ? 'text-green-800 dark:text-green-200' 
                : 'text-red-800 dark:text-red-200'
            }`}>
              {type === 'morning' ? 'Morning' : 'Evening'} Routine
            </h3>
            
            {allCompleted ? (
              <p className="text-sm text-green-700 dark:text-green-300">
                All tasks completed! You can now dismiss this reminder.
              </p>
            ) : (
              <div>
                <p className="text-sm text-red-700 dark:text-red-300 mb-2">
                  You have {incompleteTasks.length} incomplete task{incompleteTasks.length !== 1 ? 's' : ''}:
                </p>
                <ul className="text-xs text-red-600 dark:text-red-400 space-y-1">
                  {incompleteTasks.slice(0, 3).map(task => (
                    <li key={task.id} className="flex items-center space-x-1">
                      <span>•</span>
                      <span>{task.text}</span>
                    </li>
                  ))}
                  {incompleteTasks.length > 3 && (
                    <li className="text-red-500">
                      ... and {incompleteTasks.length - 3} more
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>

          <Button
            onClick={handleDismiss}
            variant="ghost"
            size="sm"
            className={`${
              allCompleted 
                ? 'text-green-600 hover:text-green-800 hover:bg-green-100' 
                : 'text-red-600 hover:text-red-800 hover:bg-red-100'
            }`}
            disabled={!allCompleted}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
