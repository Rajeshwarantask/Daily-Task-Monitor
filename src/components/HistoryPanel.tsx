import React, { useEffect, useState } from 'react';
import { Calendar, User, Clock, ChevronDown, ChevronUp } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  completedBy: string | null;
  completedAt: string | null;
  timeOfDay: 'morning' | 'evening';
}

interface HistoryPanelProps {
  isDarkMode: boolean;
}

export const HistoryPanel: React.FC<HistoryPanelProps> = ({ isDarkMode }) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0]; // YYYY-MM-DD
  });

  const [morningTasks, setMorningTasks] = useState<Task[]>([]);
  const [eveningTasks, setEveningTasks] = useState<Task[]>([]);
  const [showMorning, setShowMorning] = useState(true);
  const [showEvening, setShowEvening] = useState(true);

  const userId = "demoUser"; // Replace with dynamic user ID if needed

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch(`/api/history/${userId}/${selectedDate}`);

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error! Status: ${response.status}, Body: ${errorText}`);
        }

        const data: Task[] = await response.json();
        setMorningTasks(data.filter(t => t.timeOfDay === 'morning'));
        setEveningTasks(data.filter(t => t.timeOfDay === 'evening'));
      } catch (error) {
        console.error("Error fetching task history:", error);
      }
    };

    fetchTasks();
  }, [selectedDate]);

  const formatDateTime = (timestamp: string | null) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderTasks = (tasks: Task[]) => {
    return tasks.length === 0 ? (
      <p className="text-slate-500 dark:text-slate-400 text-center py-4">
        No completed tasks found.
      </p>
    ) : (
      tasks.map(task => (
        <div key={task.id} className="flex items-center justify-between p-3 rounded-lg border bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-700">
          <div className="flex items-center space-x-3 flex-1">
            <div className="w-5 h-5 rounded-full bg-green-500 border-green-500 flex items-center justify-center">
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <div className="flex-1">
              <div className="font-medium text-green-700 dark:text-green-300 line-through">
                {task.text}
              </div>
              {task.completedBy && (
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
    );
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-slate-700/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-full bg-gradient-to-r from-green-500 to-teal-500">
            <Calendar className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            Task History
          </h2>
        </div>

        {/* Date Picker */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-300 mb-1">
            Select Date
          </label>
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="w-52 bg-white dark:bg-slate-800 text-slate-800 dark:text-white border border-slate-300 dark:border-slate-600 rounded px-3 py-2"
          />
        </div>

        {/* Morning Section */}
        <div className="mb-4">
          <div
            className="flex justify-between items-center cursor-pointer bg-orange-100 dark:bg-orange-900/30 px-4 py-2 rounded"
            onClick={() => setShowMorning(prev => !prev)}
          >
            <h3 className="text-md font-medium text-orange-700 dark:text-orange-300">
              Morning Tasks ({morningTasks.length})
            </h3>
            {showMorning ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
          {showMorning && <div className="mt-2 space-y-2">{renderTasks(morningTasks)}</div>}
        </div>

        {/* Evening Section */}
        <div className="mb-4">
          <div
            className="flex justify-between items-center cursor-pointer bg-indigo-100 dark:bg-indigo-900/30 px-4 py-2 rounded"
            onClick={() => setShowEvening(prev => !prev)}
          >
            <h3 className="text-md font-medium text-indigo-700 dark:text-indigo-300">
              Evening Tasks ({eveningTasks.length})
            </h3>
            {showEvening ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
          {showEvening && <div className="mt-2 space-y-2">{renderTasks(eveningTasks)}</div>}
        </div>
      </div>
    </div>
  );
};
