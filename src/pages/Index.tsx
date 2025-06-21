import React, { useState, useEffect } from 'react';
import { TaskSection } from '@/components/TaskSection';
import { Header } from '@/components/Header';
import { NavigationTabs } from '@/components/NavigationTabs';
import { SettingsPanel } from '@/components/SettingsPanel';
import { HistoryPanel } from '@/components/HistoryPanel';
import { NotificationBanner } from '@/components/NotificationBanner';
import { UserOnboarding } from '@/components/UserOnboarding';
import { useNotificationSystem } from '@/hooks/useNotificationSystem';
import { useUserData } from '@/hooks/useUserData';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Sunrise, Moon } from 'lucide-react';
const Index = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState<'morning' | 'evening'>('morning');

  // User data management
  const {
    currentUser,
    householdMembers,
    isFirstTime,
    loginUser,
    updateCurrentUserName,
    logoutUser
  } = useUserData();
  const [morningTasks, setMorningTasks] = useState([{
    id: '1',
    text: 'Turn off lights',
    completed: false,
    completedBy: null,
    completedAt: null
  }, {
    id: '2',
    text: 'Turn off gas oven',
    completed: false,
    completedBy: null,
    completedAt: null
  }, {
    id: '3',
    text: 'Lock main door',
    completed: false,
    completedBy: null,
    completedAt: null
  }, {
    id: '4',
    text: 'Lock bathroom',
    completed: false,
    completedBy: null,
    completedAt: null
  }, {
    id: '5',
    text: 'Turn off heater',
    completed: false,
    completedBy: null,
    completedAt: null
  }]);
  const [nightTasks, setNightTasks] = useState([{
    id: '6',
    text: 'Turn off all lights',
    completed: false,
    completedBy: null,
    completedAt: null
  }, {
    id: '7',
    text: 'Turn off TV',
    completed: false,
    completedBy: null,
    completedAt: null
  }, {
    id: '8',
    text: 'Lock stair gate',
    completed: false,
    completedBy: null,
    completedAt: null
  }, {
    id: '9',
    text: 'Lock main gate',
    completed: false,
    completedBy: null,
    completedAt: null
  }, {
    id: '10',
    text: 'Check all windows',
    completed: false,
    completedBy: null,
    completedAt: null
  }]);
  const [reminderTimes, setReminderTimes] = useState({
    morning: '06:30',
    night: '22:30'
  });
  const {
    toast
  } = useToast();

  // Initialize notification system
  const {
    notification,
    dismissNotification
  } = useNotificationSystem(morningTasks, nightTasks, reminderTimes, currentUser?.name || 'Unknown User');

  // Toggle dark mode
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Show onboarding if first time or no current user
  if (isFirstTime || !currentUser) {
    return <UserOnboarding onComplete={loginUser} isDarkMode={isDarkMode} />;
  }
  const toggleTask = (taskId: string, isMorning: boolean) => {
    const now = new Date().toISOString();
    const userName = currentUser.name;
    if (isMorning) {
      setMorningTasks(prev => prev.map(task => task.id === taskId ? {
        ...task,
        completed: !task.completed,
        completedBy: !task.completed ? userName : null,
        completedAt: !task.completed ? now : null
      } : task));
    } else {
      setNightTasks(prev => prev.map(task => task.id === taskId ? {
        ...task,
        completed: !task.completed,
        completedBy: !task.completed ? userName : null,
        completedAt: !task.completed ? now : null
      } : task));
    }
    toast({
      title: "Task Updated",
      description: "Task status has been synced across all devices",
      duration: 2000
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
  const getCurrentTasks = () => {
    return selectedTimeOfDay === 'morning' ? morningTasks : nightTasks;
  };
  const getCurrentNotificationTasks = () => {
    if (notification.type === 'morning') return morningTasks;
    if (notification.type === 'evening') return nightTasks;
    return [];
  };
  const handleUserNameUpdate = (newName: string) => {
    updateCurrentUserName(newName);
  };
  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return <div className="space-y-6">
            {/* Morning/Evening Toggle */}
            <div className="flex space-x-2 px-[40px]">
              <Button onClick={() => setSelectedTimeOfDay('morning')} variant={selectedTimeOfDay === 'morning' ? 'default' : 'outline'} className={`flex items-center space-x-2 ${selectedTimeOfDay === 'morning' ? 'bg-orange-500 hover:bg-orange-600' : ''}`}>
                <Sunrise className="w-4 h-4" />
                <span>Morning</span>
              </Button>
              <Button onClick={() => setSelectedTimeOfDay('evening')} variant={selectedTimeOfDay === 'evening' ? 'default' : 'outline'} className={`flex items-center space-x-2 ${selectedTimeOfDay === 'evening' ? 'bg-indigo-500 hover:bg-indigo-600' : ''}`}>
                <Moon className="w-4 h-4" />
                <span>Evening</span>
              </Button>
            </div>

            <TaskSection title={selectedTimeOfDay === 'morning' ? 'Morning Tasks' : 'Evening Tasks'} tasks={getCurrentTasks()} onToggleTask={taskId => toggleTask(taskId, selectedTimeOfDay === 'morning')} timeOfDay={selectedTimeOfDay === 'morning' ? 'morning' : 'night'} />
          </div>;
      case 'history':
        return <HistoryPanel morningTasks={morningTasks} nightTasks={nightTasks} isDarkMode={isDarkMode} />;
      case 'settings':
        return <SettingsPanel reminderTimes={reminderTimes} setReminderTimes={setReminderTimes} isDarkMode={isDarkMode} setIsDarkMode={setIsDarkMode} onResetTasks={resetDailyTasks} morningTasks={morningTasks} nightTasks={nightTasks} setMorningTasks={setMorningTasks} setNightTasks={setNightTasks} />;
      default:
        return null;
    }
  };
  return <div className={`min-h-screen transition-colors duration-300 ${isDarkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-white to-orange-50'}`}>
      <div className="max-w-md mx-auto min-h-screen flex flex-col">
        <Header isDarkMode={isDarkMode} userName={currentUser.name} setUserName={handleUserNameUpdate} householdMembers={householdMembers} onUpdateUserName={handleUserNameUpdate} onLogout={logoutUser} />
        
        {/* Persistent Notification Banner */}
        <NotificationBanner isActive={notification.isActive} type={notification.type} tasks={getCurrentNotificationTasks()} onDismiss={dismissNotification} isDarkMode={isDarkMode} />
        
        <main className={`flex-1 px-4 py-6 pb-20 overflow-y-auto ${notification.isActive ? 'pt-32' : ''}`}>
          {renderContent()}
        </main>

        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} isDarkMode={isDarkMode} />
      </div>
    </div>;
};
export default Index;