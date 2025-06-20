
import React from 'react';
import { TaskItem } from './TaskItem';
import { Sunrise, Moon, CheckCircle2 } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  completedBy: string | null;
  completedAt: string | null;
}

interface TaskSectionProps {
  title: string;
  tasks: Task[];
  onToggleTask: (taskId: string) => void;
  timeOfDay: 'morning' | 'night';
}

export const TaskSection: React.FC<TaskSectionProps> = ({
  title,
  tasks,
  onToggleTask,
  timeOfDay
}) => {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const progressPercentage = (completedTasks / totalTasks) * 100;

  const getIcon = () => {
    if (timeOfDay === 'morning') {
      return <Sunrise className="w-5 h-5" />;
    }
    return <Moon className="w-5 h-5" />;
  };

  const getGradientClass = () => {
    if (timeOfDay === 'morning') {
      return 'from-orange-400 to-yellow-400';
    }
    return 'from-indigo-500 to-purple-600';
  };

  return (
    <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-slate-700/20">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-full bg-gradient-to-r ${getGradientClass()}`}>
            {getIcon()}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
              {title}
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">
              {completedTasks} of {totalTasks} completed
            </p>
          </div>
        </div>
        {completedTasks === totalTasks && totalTasks > 0 && (
          <CheckCircle2 className="w-6 h-6 text-green-500" />
        )}
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-slate-600 dark:text-slate-300 mb-2">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}%</span>
        </div>
        <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
          <div
            className={`h-2 rounded-full bg-gradient-to-r ${getGradientClass()} transition-all duration-500 ease-out`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskItem
            key={task.id}
            task={task}
            onToggle={() => onToggleTask(task.id)}
          />
        ))}
      </div>
    </div>
  );
};
