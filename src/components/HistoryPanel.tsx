import React, { useState } from 'react';
import { Calendar, User, Clock } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
  const [selectedDate, setSelectedDate] = useState('today');
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<'all' | 'morning' | 'evening'>('all');
  const completedMorningTasks = morningTasks.filter(task => task.completed);
  const completedNightTasks = nightTasks.filter(task => task.completed);
  const morningProgress = morningTasks.length > 0 ? completedMorningTasks.length / morningTasks.length * 100 : 0;
  const nightProgress = nightTasks.length > 0 ? completedNightTasks.length / nightTasks.length * 100 : 0;
  const formatDateTime = (timestamp: string | null) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  const handleTimeOfDayChange = (value: string) => {
    setSelectedTimeOfDay(value as 'all' | 'morning' | 'evening');
  };
  const getFilteredTasks = () => {
    let tasks: Task[] = [];
    if (selectedTimeOfDay === 'all') {
      tasks = [...completedMorningTasks, ...completedNightTasks];
    } else if (selectedTimeOfDay === 'morning') {
      tasks = completedMorningTasks;
    } else {
      tasks = completedNightTasks;
    }
    return tasks.sort((a, b) => {
      if (!a.completedAt || !b.completedAt) return 0;
      return new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime();
    });
  };
  const filteredTasks = getFilteredTasks();

  // Generate date options
  const dateOptions = [{
    value: 'today',
    label: 'Today'
  }, {
    value: 'yesterday',
    label: 'Yesterday'
  }, {
    value: '2-days-ago',
    label: '2 Days Ago'
  }, {
    value: '3-days-ago',
    label: '3 Days Ago'
  }, {
    value: '4-days-ago',
    label: '4 Days Ago'
  }, {
    value: '5-days-ago',
    label: '5 Days Ago'
  }, {
    value: '1-week-ago',
    label: '1 Week Ago'
  }];
  return <div className="space-y-6">
      {/* Daily Summary */}
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-slate-700/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-full bg-gradient-to-r from-green-500 to-teal-500">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            Task History
          </h2>
        </div>

        <div className="flex items-center justify-between mb-6">
          <h3 className="text-md font-medium text-slate-700 dark:text-slate-300"></h3>
          <div className="flex space-x-2">
            <Select value={selectedDate} onValueChange={setSelectedDate}>
              <SelectTrigger className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
                {dateOptions.map(option => <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={selectedTimeOfDay} onValueChange={handleTimeOfDayChange}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-lg">
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="morning">Morning</SelectItem>
                <SelectItem value="evening">Evening</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
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

      {/* Completed Tasks History */}
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-slate-700/20">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
          Completed Tasks ({selectedDate} - {selectedTimeOfDay})
        </h3>

        <div className="space-y-3">
          {filteredTasks.length === 0 ? <p className="text-slate-500 dark:text-slate-400 text-center py-8">
              No completed tasks found for {selectedDate} ({selectedTimeOfDay}).
            </p> : filteredTasks.map(task => <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
                <div className="flex items-center space-x-3 flex-1">
                  <div className="w-5 h-5 rounded-full bg-green-500 border-green-500 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full" />
                  </div>
                  <div className="flex-1">
                    <div className="font-medium text-green-700 dark:text-green-300 line-through">
                      {task.text}
                    </div>
                    {task.completedBy && <div className="flex items-center space-x-4 mt-1 text-xs text-slate-600 dark:text-slate-400">
                        <div className="flex items-center space-x-1">
                          <User className="w-3 h-3" />
                          <span>{task.completedBy}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDateTime(task.completedAt)}</span>
                        </div>
                      </div>}
                  </div>
                </div>
              </div>)}
        </div>
      </div>
    </div>;
};