
import React from 'react';
import { Calendar, User, Clock } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  completedBy: string | null;
  completedAt: string | null;
}

interface HistoryPanelProps {
  morningTasks: Task[];
  nightTasks: Task[];
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  morningTasks,
  nightTasks
}) => {
  const completedMorningTasks = morningTasks.filter(task => task.completed);
  const completedNightTasks = nightTasks.filter(task => task.completed);
  
  const allCompletedTasks = [...completedMorningTasks, ...completedNightTasks]
    .sort((a, b) => {
      if (!a.completedAt || !b.completedAt) return 0;
      return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
    });

  const formatDateTime = (timestamp: string | null) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const morningProgress = (completedMorningTasks.length / morningTasks.length) * 100;
  const nightProgress = (completedNightTasks.length / nightTasks.length) * 100;

  return (
    <div className="space-y-6">
      {/* Daily Summary */}
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-slate-700/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-full bg-gradient-to-r from-green-500 to-teal-500">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            Today's Progress
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {Math.round(morningProgress)}%
            </div>
            <div className="text-sm text-orange-700 dark:text-orange-300">
              Morning Tasks
            </div>
          </div>
          <div className="text-center p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl">
            <div className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
              {Math.round(nightProgress)}%
            </div>
            <div className="text-sm text-indigo-700 dark:text-indigo-300">
              Night Tasks
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-slate-700/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            Recent Activity
          </h2>
        </div>

        <div className="space-y-3">
          {allCompletedTasks.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-center py-8">
              No completed tasks yet today. Start checking off your routine!
            </p>
          ) : (
            allCompletedTasks.map((task) => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg"
              >
                <div className="flex-1">
                  <div className="font-medium text-slate-800 dark:text-slate-200">
                    {task.text}
                  </div>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-slate-600 dark:text-slate-400">
                    <div className="flex items-center space-x-1">
                      <User className="w-3 h-3" />
                      <span>{task.completedBy}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDateTime(task.completedAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
