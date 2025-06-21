
import { useState, useEffect } from 'react';

export interface User {
  id: string;
  name: string;
  role: string;
  lastActive: string;
}

export interface CurrentUser extends User {
  isActive: true;
}

const CURRENT_USER_KEY = 'currentUser';
const HOUSEHOLD_MEMBERS_KEY = 'householdMembers';

export const useUserData = () => {
  const [currentUser, setCurrentUser] = useState<CurrentUser | null>(null);
  const [householdMembers, setHouseholdMembers] = useState<User[]>([]);
  const [isFirstTime, setIsFirstTime] = useState(true);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedCurrentUser = localStorage.getItem(CURRENT_USER_KEY);
    const savedMembers = localStorage.getItem(HOUSEHOLD_MEMBERS_KEY);

    if (savedCurrentUser) {
      const user = JSON.parse(savedCurrentUser);
      setCurrentUser({ ...user, isActive: true });
      setIsFirstTime(false);
    }

    if (savedMembers) {
      setHouseholdMembers(JSON.parse(savedMembers));
    }
  }, []);

  const loginUser = (name: string, role: string) => {
    const userId = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newUser: CurrentUser = {
      id: userId,
      name,
      role,
      lastActive: new Date().toISOString(),
      isActive: true
    };

    // Save current user
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
    setCurrentUser(newUser);

    // Add to household members if not already there
    const existingMembers = JSON.parse(localStorage.getItem(HOUSEHOLD_MEMBERS_KEY) || '[]');
    const memberExists = existingMembers.some((member: User) => 
      member.name === name && member.role === role
    );

    if (!memberExists) {
      const updatedMembers = [...existingMembers, { ...newUser, isActive: false }];
      localStorage.setItem(HOUSEHOLD_MEMBERS_KEY, JSON.stringify(updatedMembers));
      setHouseholdMembers(updatedMembers);
    } else {
      setHouseholdMembers(existingMembers);
    }

    setIsFirstTime(false);
  };

  const updateCurrentUserName = (newName: string) => {
    if (!currentUser) return;

    const updatedUser = { ...currentUser, name: newName };
    
    // Update current user in localStorage
    localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    setCurrentUser(updatedUser);

    // Update in household members list
    const updatedMembers = householdMembers.map(member => 
      member.id === currentUser.id ? { ...member, name: newName } : member
    );
    localStorage.setItem(HOUSEHOLD_MEMBERS_KEY, JSON.stringify(updatedMembers));
    setHouseholdMembers(updatedMembers);
  };

  const logoutUser = () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    setCurrentUser(null);
    setIsFirstTime(true);
  };

  const getHouseholdMembersWithActiveStatus = () => {
    return householdMembers.map(member => ({
      ...member,
      isActive: currentUser?.id === member.id
    }));
  };

  return {
    currentUser,
    householdMembers: getHouseholdMembersWithActiveStatus(),
    isFirstTime,
    loginUser,
    updateCurrentUserName,
    logoutUser
  };
};
