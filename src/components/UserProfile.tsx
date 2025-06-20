
import React, { useState } from 'react';
import { User, Settings } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface UserProfileProps {
  isDarkMode: boolean;
  userName: string;
  setUserName: (name: string) => void;
}

export const UserProfile: React.FC<UserProfileProps> = ({
  isDarkMode,
  userName,
  setUserName
}) => {
  const [tempName, setTempName] = useState(userName);

  const handleSaveName = () => {
    setUserName(tempName);
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" className="p-2 rounded-full">
          <Avatar className="w-8 h-8">
            <AvatarFallback className={`${
              isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {userName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </Button>
      </SheetTrigger>
      <SheetContent className={`${
        isDarkMode ? 'bg-slate-900 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <SheetHeader>
          <SheetTitle className={isDarkMode ? 'text-white' : 'text-slate-800'}>
            User Profile
          </SheetTitle>
        </SheetHeader>
        <div className="space-y-6 mt-6">
          <div className="flex items-center space-x-4">
            <Avatar className="w-16 h-16">
              <AvatarFallback className={`text-2xl ${
                isDarkMode ? 'bg-slate-700 text-white' : 'bg-slate-200 text-slate-700'
              }`}>
                {userName.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className={`text-xl font-semibold ${
                isDarkMode ? 'text-white' : 'text-slate-800'
              }`}>
                {userName}
              </h2>
              <p className={`text-sm ${
                isDarkMode ? 'text-slate-300' : 'text-slate-600'
              }`}>
                Household Member
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="user-name" className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>
                Display Name
              </Label>
              <Input
                id="user-name"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                className="mt-2"
                placeholder="Enter your name"
              />
            </div>
            <Button onClick={handleSaveName} className="w-full">
              Save Changes
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};
