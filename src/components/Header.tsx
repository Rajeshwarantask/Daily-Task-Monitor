
import React from 'react';
import { CheckCircle } from 'lucide-react';

interface HeaderProps {
  isDarkMode: boolean;
}

export const Header: React.FC<HeaderProps> = ({ isDarkMode }) => {
  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <header className={`sticky top-0 z-10 backdrop-blur-md border-b transition-colors duration-300 ${
      isDarkMode 
        ? 'bg-slate-900/80 border-slate-700' 
        : 'bg-white/80 border-slate-200'
    }`}>
      <div className="px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-full ${
              isDarkMode ? 'bg-blue-600' : 'bg-gradient-to-r from-blue-500 to-teal-500'
            }`}>
              <CheckCircle className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className={`text-xl font-bold ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                Daily Routine
              </h1>
              <p className={`text-sm ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>
                {today}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
