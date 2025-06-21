import { useState, useEffect, useCallback } from 'react';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  completedBy: string | null;
  completedAt: string | null;
}

interface NotificationState {
  isActive: boolean;
  type: 'morning' | 'evening' | null;
  startTime: string | null;
}

export const useNotificationSystem = (
  morningTasks: Task[],
  nightTasks: Task[],
  reminderTimes: { morning: string; night: string },
  userName: string
) => {
  const [notification, setNotification] = useState<NotificationState>({
    isActive: false,
    type: null,
    startTime: null
  });

  const [hasPermission, setHasPermission] = useState(false);

  // Request notification permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      if (Notification.permission === 'granted') {
        setHasPermission(true);
      } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
          setHasPermission(permission === 'granted');
        });
      }
    }
  }, []);

  const checkTasksCompletion = useCallback((tasks: Task[]) => {
    return tasks.every(task => task.completed);
  }, []);

  const triggerPersistentNotification = useCallback((type: 'morning' | 'evening') => {
    if (!hasPermission) return;

    const tasks = type === 'morning' ? morningTasks : nightTasks;
    const incompleteTasks = tasks.filter(task => !task.completed);

    if (incompleteTasks.length > 0) {
      const notificationTitle = `${type === 'morning' ? 'Morning' : 'Evening'} Routine Reminder`;
      const notificationBody = `You have ${incompleteTasks.length} incomplete tasks. Please complete all items before dismissing.`;

      // Create persistent notification
      const notif = new Notification(notificationTitle, {
        body: notificationBody,
        icon: '/favicon.ico',
        requireInteraction: true, // Prevents auto-dismiss
        persistent: true,
        tag: `${type}-routine-${Date.now()}` // Unique tag to prevent duplicates
      });

      // Set notification as active
      setNotification({
        isActive: true,
        type,
        startTime: new Date().toISOString()
      });

      // Keep notification alive until all tasks are complete
      const checkInterval = setInterval(() => {
        const currentTasks = type === 'morning' ? morningTasks : nightTasks;
        if (checkTasksCompletion(currentTasks)) {
          clearInterval(checkInterval);
          notif.close();
          setNotification({
            isActive: false,
            type: null,
            startTime: null
          });
        }
      }, 5000); // Check every 5 seconds

      // Handle notification click - don't close, just focus the app
      notif.onclick = () => {
        window.focus();
        // Don't close the notification
      };
    }
  }, [morningTasks, nightTasks, hasPermission, checkTasksCompletion]);

  // Check for reminder times
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM format

      // Check morning reminder
      if (currentTime === reminderTimes.morning && !notification.isActive) {
        if (!checkTasksCompletion(morningTasks)) {
          triggerPersistentNotification('morning');
        }
      }

      // Check evening reminder
      if (currentTime === reminderTimes.night && !notification.isActive) {
        if (!checkTasksCompletion(nightTasks)) {
          triggerPersistentNotification('evening');
        }
      }
    };

    const interval = setInterval(checkTime, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [reminderTimes, morningTasks, nightTasks, notification.isActive, triggerPersistentNotification, checkTasksCompletion]);

  // Clear notification when all tasks are completed
  useEffect(() => {
    if (notification.isActive && notification.type) {
      const tasks = notification.type === 'morning' ? morningTasks : nightTasks;
      if (checkTasksCompletion(tasks)) {
        setNotification({
          isActive: false,
          type: null,
          startTime: null
        });
      }
    }
  }, [morningTasks, nightTasks, notification, checkTasksCompletion]);

  const dismissNotification = useCallback(() => {
    // Only allow dismissal if all tasks are complete
    if (notification.type) {
      const tasks = notification.type === 'morning' ? morningTasks : nightTasks;
      if (checkTasksCompletion(tasks)) {
        setNotification({
          isActive: false,
          type: null,
          startTime: null
        });
        return true;
      }
    }
    return false;
  }, [notification.type, morningTasks, nightTasks, checkTasksCompletion]);

  return {
    notification,
    hasPermission,
    dismissNotification,
    triggerPersistentNotification
  };
};
