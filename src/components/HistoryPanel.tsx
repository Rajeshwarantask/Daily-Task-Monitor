
import React, { useState } from 'react';
import { Calendar, User, Clock, ChevronDown, Sunrise, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  isDarkMode: boolean;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({
  morningTasks,
  nightTasks,
  isDarkMode
}) => {
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<'morning' | 'evening'>('morning');
  const [selectedDate, setSelectedDate] = useState('today');

  const completedMorningTasks = morningTasks.filter(task => task.completed);
  const completedNightTasks = nightTasks.filter(task => task.completed);
  
  const morningProgress = (completedMorningTasks.length / morningTasks.length) * 100;
  const nightProgress = (completedNightTasks.length / nightTasks.length) * 100;

  const getCurrentTasks = () => {
    return selectedTimeOfDay === 'morning' ? morningTasks : nightTasks;
  };

  const formatDateTime = (timestamp: string | null) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const currentTasks = getCurrentTasks();
  const completedCurrentTasks = currentTasks.filter(task => task.completed);

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
              Evening Tasks
            </div>
          </div>
        </div>
      </div>

      {/* Day-wise Task View */}
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-slate-700/20">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            Task Details
          </h2>
          <Select value={selectedDate} onValueChange={setSelectedDate}>
            <SelectTrigger className="w-32">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="yesterday">Yesterday</SelectItem>
              <SelectItem value="2-days-ago">2 Days Ago</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Morning/Evening Toggle */}
        <div className="flex space-x-2 mb-6">
          <Button
            onClick={() => setSelectedTimeOfDay('morning')}
            variant={selectedTimeOfDay === 'morning' ? 'default' : 'outline'}
            className={`flex items-center space-x-2 ${
              selectedTimeOfDay === 'morning'
                ? 'bg-orange-500 hover:bg-orange-600'
                : ''
            }`}
          >
            <Sunrise className="w-4 h-4" />
            <span>Morning</span>
          </Button>
          <Button
            onClick={() => setSelectedTimeOfDay('evening')}
            variant={selectedTimeOfDay === 'evening' ? 'default' : 'outline'}
            className={`flex items-center space-x-2 ${
              selectedTimeOfDay === 'evening'
                ? 'bg-indigo-500 hover:bg-indigo-600'
                : ''
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>Evening</span>
          </Button>
        </div>

        {/* Task List */}
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-400 mb-3">
            <span>
              {selectedTimeOfDay === 'morning' ? 'Morning' : 'Evening'} Tasks 
              ({completedCurrentTasks.length}/{currentTasks.length} completed)
            </span>
          </div>

          {currentTasks.length === 0 ? (
            <p className="text-slate-500 dark:text-slate-400 text-center py-8">
              No tasks found for {selectedTimeOfDay === 'morning' ? 'morning' : 'evening'}.
            </p>
          ) : (
            currentTasks.map((task) => (
              <div
                key={task.id}
                className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                  task.completed
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700'
                    : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
                }`}
              >
                <div className="flex items-center space-x-3 flex-1">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      task.completed
                        ? 'bg-green-500 border-green-500'
                        : 'border-slate-300 dark:border-slate-500'
                    }`}
                  >
                    {task.completed && (
                      <div className="w-2 h-2 bg-white rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <div
                      className={`font-medium ${
                        task.completed
                          ? 'text-green-700 dark:text-green-300 line-through'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {task.text}
                    </div>
                    {task.completed && task.completedBy && (
                      <div className="flex items-center space-x-4 mt-1 text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{task.completedBy}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDateTime(task.completedAt)}</span>
                        </div>
                      </div>
                    )}
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
