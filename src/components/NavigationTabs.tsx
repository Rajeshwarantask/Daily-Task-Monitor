
import React from 'react';
import { Home, History, Settings } from 'lucide-react';

interface NavigationTabsProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDarkMode: boolean;
}

export const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  setActiveTab,
  isDarkMode
}) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'history', label: 'History', icon: History },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className={`fixed bottom-0 left-0 right-0 backdrop-blur-md border-t transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-slate-900/80 border-slate-700' 
        : 'bg-white/80 border-slate-200'
    }`}>
      <div className="max-w-md mx-auto">
        <div className="flex items-center justify-around py-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex flex-col items-center justify-center py-2 px-4 rounded-xl transition-all duration-200 active:scale-95 ${
                  isActive
                    ? `${isDarkMode ? 'bg-blue-600' : 'bg-blue-500'} text-white shadow-lg`
                    : `${isDarkMode ? 'text-slate-400 hover:text-slate-200' : 'text-slate-500 hover:text-slate-700'} hover:bg-slate-100 dark:hover:bg-slate-800`
                }`}
              >
                <Icon className="w-5 h-5 mb-1" />
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};
