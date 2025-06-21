
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { User, Home } from 'lucide-react';

interface UserOnboardingProps {
  onComplete: (name: string, role: string) => void;
  isDarkMode: boolean;
}

export const UserOnboarding: React.FC<UserOnboardingProps> = ({ onComplete, isDarkMode }) => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && role.trim()) {
      setIsSubmitting(true);
      // Simulate a brief loading state
      setTimeout(() => {
        onComplete(name.trim(), role.trim());
        setIsSubmitting(false);
      }, 500);
    }
  };

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${
      isDarkMode 
        ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' 
        : 'bg-gradient-to-br from-blue-50 via-white to-orange-50'
    }`}>
      <Card className={`w-full max-w-md ${
        isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'
      }`}>
        <CardHeader className="text-center">
          <div className={`mx-auto p-3 rounded-full mb-4 ${
            isDarkMode ? 'bg-blue-600' : 'bg-gradient-to-r from-blue-500 to-teal-500'
          }`}>
            <Home className="w-8 h-8 text-white" />
          </div>
          <CardTitle className={`text-2xl font-bold ${
            isDarkMode ? 'text-white' : 'text-slate-800'
          }`}>
            Welcome to Daily Routine
          </CardTitle>
          <p className={`text-sm ${
            isDarkMode ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Let's set up your profile to get started
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>
                Your Name
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                className="mt-2"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="role" className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>
                Your Role
              </Label>
              <Input
                id="role"
                type="text"
                value={role}
                onChange={(e) => setRole(e.target.value)}
                placeholder="e.g., Dad, Mom, Sister, etc."
                className="mt-2"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full mt-6"
              disabled={!name.trim() || !role.trim() || isSubmitting}
            >
              {isSubmitting ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Setting up...</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>Get Started</span>
                </div>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
