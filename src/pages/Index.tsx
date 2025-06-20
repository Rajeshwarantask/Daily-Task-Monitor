
import React, { useState, useEffect } from 'react';
import { TaskSection } from '@/components/TaskSection';
import { Header } from '@/components/Header';
import { NavigationTabs } from '@/components/NavigationTabs';
import { SettingsPanel } from '@/components/SettingsPanel';
import { HistoryPanel } from '@/components/HistoryPanel';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [morningTasks, setMorningTasks] = useState([
    { id: '1', text: 'Turn off lights', completed: false, completedBy: null, completedAt: null },
    { id: '2', text: 'Turn off gas oven', completed: false, completedBy: null, completedAt: null },
    { id: '3', text: 'Lock main door', completed: false, completedBy: null, completedAt: null },
    { id: '4', text: 'Lock bathroom', completed: false, completedBy: null, completedAt: null },
    { id: '5', text: 'Turn off heater', completed: false, completedBy: null, completedAt: null },
  ]);
  const [nightTasks, setNightTasks] = useState([
    { id: '6', text: 'Turn off all lights', completed: false, completedBy: null, completedAt: null },
    { id: '7', text: 'Turn off TV', completed: false, completedBy: null, completedAt: null },
    { id: '8', text: 'Lock stair gate', completed: false, completedBy: null, completedAt: null },
    { id: '9', text: 'Lock main gate', completed: false, completedBy: null, completedAt: null },
    { id: '10', text: 'Check all windows', completed: false, completedBy: null, completedAt: null },
  ]);
  const [reminderTimes, setReminderTimes] = useState({
    morning: '06:30',
    night: '22:30'
  });
  const { toast } = useToast();

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTask = (taskId: string, isMorning: boolean) => {
    const currentUser = 'User 1'; // This would come from auth in a real app
    const now = new Date().toISOString();
    
    if (isMorning) {
      setMorningTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              completed: !task.completed,
              completedBy: !task.completed ? currentUser : null,
              completedAt: !task.completed ? now : null
            }
          : task
      ));
    } else {
      setNightTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              completed: !task.completed,
              completedBy: !task.completed ? currentUser : null,
              completedAt: !task.completed ? now : null
            }
          : task
      ));
    }
    
    toast({
      title: "Task Updated",
      description: "Task status has been synced across all devices",
      duration: 2000,
    });
  };

  const resetDailyTasks = () => {
    setMorningTasks(prev => prev.map(task => ({
      ...task,
      completed: false,
      completedBy: null,
      completedAt: null
    })));
    setNightTasks(prev => prev.map(task => ({
      ...task,
      completed: false,
      completedBy: null,
      completedAt: null
    })));
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <div className="space-y-6">
            <TaskSection
              title="Morning Tasks"
              tasks={morningTasks}
              onToggleTask={(taskId) => toggleTask(taskId, true)}
              timeOfDay="morning"
            />
            <TaskSection
              title="Night Tasks"
              tasks={nightTasks}
              onToggleTask={(taskId) => toggleTask(taskId, false)}
              timeOfDay="night"
            />
          </div>
        );
      case 'history':
        return (
          <HistoryPanel 
            morningTasks={morningTasks}
            nightTasks={nightTasks}
          />
        );
      case 'settings':
        return (
          <SettingsPanel
            reminderTimes={reminderTimes}
            setReminderTimes={setReminderTimes}
            isDarkMode={isDarkMode}
            setIsDarkMode={setIsDarkMode}
            onResetTasks={resetDailyTasks}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-orange-50'
    }`}>
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <Header isDarkMode={isDarkMode} />
        
        <main className="flex-1 px-4 py-6 pb-20 overflow-y-auto">
          {renderContent()}
        </main>

        <NavigationTabs 
          activeTab={activeTab} 
          setActiveTab={setActiveTab}
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
};

export default Index;
