import React, { useState } from 'react';
import { User, Settings, Users, LogOut } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { subscribeUserToPush } from "@/utils/pushNotifications";

interface UserProfileProps {
  isDarkMode: boolean;
  userName: string;
  setUserName: (name: string) => void;
  householdMembers: Array<{
    id: string;
    name: string;
    role: string;
    isActive: boolean;
  }>;
  onUpdateUserName: (newName: string) => void;
  onLogout: () => void;
}
export const UserProfile: React.FC<UserProfileProps> = ({
  isDarkMode,
  userName,
  householdMembers,
  onUpdateUserName,
  onLogout
}) => {
  const [tempName, setTempName] = useState(userName);
  const handleSaveName = () => {
    if (tempName.trim()) {
      onUpdateUserName(tempName.trim());
      if (!localStorage.getItem("pushSubscribed")) {
        subscribeUserToPush(tempName.trim());
        localStorage.setItem("pushSubscribed", "true");
      }
    }
  };
  const handleLogout = () => {
    onLogout();
  };
  return <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="p-2 rounded-full">
          <Avatar className="w-8 h-8">
            <AvatarFallback className={`${isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent className={`${isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'}`}>
        <SheetHeader>
          <SheetTitle className={isDarkMode ? 'text-white' : 'text-slate-800'}>
            User Profile
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-6 mt-6">
          {/* Current User Profile */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className={`text-2xl ${isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'}`}>
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>
                {userName}
              </h2>
              <p className={`text-sm ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`}>
                {householdMembers.find(m => m.isActive)?.role || 'Household Member'} (You)
              </p>
            </div>
          </div>

          {/* Edit Name Section - Only for current user */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="user-name" className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>
                Display Name
              </Label>
              <Input id="user-name" value={tempName} onChange={e => setTempName(e.target.value)} className="mt-2" placeholder="Enter your name" />
            </div>
            <Button onClick={handleSaveName} className="w-full">
              Save Changes
            </Button>
          </div>

          {/* Household Members Section - Read-only list */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <Users className={`w-5 h-5 ${isDarkMode ? 'text-slate-300' : 'text-slate-600'}`} />
              <h3 className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-slate-800'}`}>Members</h3>
            </div>
            
            <div className="space-y-2">
              {householdMembers.map(member => <div key={member.id} className={`flex items-center justify-between p-3 rounded-lg border ${member.isActive ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700' : isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-slate-50 border-slate-200'}`}>
                  <div className="flex items-center space-x-3">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className={`text-sm ${member.isActive ? 'bg-blue-500 text-white' : isDarkMode ? 'bg-slate-600 text-white' : 'bg-slate-300 text-slate-700'}`}>
                        {member.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <span className={`font-medium block ${member.isActive ? 'text-blue-700 dark:text-blue-300' : isDarkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                        {member.name}
                      </span>
                      <span className={`text-xs ${member.isActive ? 'text-blue-600 dark:text-blue-400' : isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                        {member.role}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {member.isActive && <>
                        <span className={`text-xs font-medium ${isDarkMode ? 'text-blue-300' : 'text-blue-600'}`}>
                          Active
                        </span>
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      </>}
                  </div>
                </div>)}
            </div>
            
            {/* Information note */}
            <div className={`text-xs p-3 rounded-lg ${isDarkMode ? 'bg-slate-800 text-slate-400 border border-slate-700' : 'bg-slate-50 text-slate-600 border border-slate-200'}`}>
              <p>All members share the same checklist. Task updates are logged with the member's name and timestamp for accountability.</p>
            </div>
          </div>

          {/* Logout Section */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button onClick={handleLogout} variant="outline" className="w-full flex items-center space-x-2 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20">
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>;
};