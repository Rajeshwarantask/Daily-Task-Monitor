
import React from 'react';
import { Clock, Moon, Sun, RotateCcw } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';

interface SettingsPanelProps {
  reminderTimes: {
    morning: string;
    night: string;
  };
  setReminderTimes: (times: { morning: string; night: string }) => void;
  isDarkMode: boolean;
  setIsDarkMode: (isDark: boolean) => void;
  onResetTasks: () => void;
}

export const SettingsPanel: React.FC<SettingsPanelProps> = ({
  reminderTimes,
  setReminderTimes,
  isDarkMode,
  setIsDarkMode,
  onResetTasks
}) => {
  return (
    <div className="space-y-6">
      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-slate-700/20">
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600">
            <Clock className="w-5 h-5 text-white" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
            Reminder Times
          </h2>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="morning-time" className="text-slate-700 dark:text-slate-200">
              Morning Reminder
            </Label>
            <Input
              id="morning-time"
              type="time"
              value={reminderTimes.morning}
              onChange={(e) => setReminderTimes({
                ...reminderTimes,
                morning: e.target.value
              })}
              className="mt-2"
            />
          </div>
          
          <div>
            <Label htmlFor="night-time" className="text-slate-700 dark:text-slate-200">
              Night Reminder
            </Label>
            <Input
              id="night-time"
              type="time"
              value={reminderTimes.night}
              onChange={(e) => setReminderTimes({
                ...reminderTimes,
                night: e.target.value
              })}
              className="mt-2"
            />
          </div>
        </div>
      </div>

      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-slate-700/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-full bg-gradient-to-r from-orange-400 to-pink-500">
              {isDarkMode ? <Moon className="w-5 h-5 text-white" /> : <Sun className="w-5 h-5 text-white" />}
            </div>
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white">
                Dark Mode
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Toggle dark theme
              </p>
            </div>
          </div>
          <Switch
            checked={isDarkMode}
            onCheckedChange={setIsDarkMode}
          />
        </div>
      </div>

      <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-slate-700/20">
        <Button
          onClick={onResetTasks}
          variant="outline"
          className="w-full flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset All Tasks</span>
        </Button>
      </div>
    </div>
  );
};
