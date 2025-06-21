import { useState, useEffect, useCallback, useRef } from 'react';

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

interface ReminderTimes {
  morning: string; // "06:30"
  night: string;   // "22:30"
}

const TASKS_KEY = 'dtm_tasks';
const PREFS_KEY = 'dtm_prefs';

function getTodayDateStr() {
  const now = new Date();
  return now.toISOString().slice(0, 10); // YYYY-MM-DD
}

// Change return type to match the actual structure
function loadTasks(): { date: string; morning: Task[]; night: Task[] } {
  const data = localStorage.getItem(TASKS_KEY);
  return data ? JSON.parse(data) : { date: getTodayDateStr(), morning: [], night: [] };
}

function saveTasks(morning: Task[], night: Task[]) {
  localStorage.setItem(TASKS_KEY, JSON.stringify({
    date: getTodayDateStr(),
    morning,
    night
  }));
}

function loadPrefs(): ReminderTimes {
  const data = localStorage.getItem(PREFS_KEY);
  return data ? JSON.parse(data) : { morning: '06:30', night: '22:30' };
}

function savePrefs(prefs: ReminderTimes) {
  localStorage.setItem(PREFS_KEY, JSON.stringify(prefs));
}

export const useNotificationSystem = (
  initialMorningTasks: Task[],
  initialNightTasks: Task[],
  initialReminderTimes: ReminderTimes,
  userName: string
) => {
  // State for tasks and preferences, loaded from localStorage
  const [morningTasks, setMorningTasks] = useState<Task[]>(() => {
    const stored = loadTasks();
    return stored.date === getTodayDateStr() ? stored.morning : initialMorningTasks;
  });
  const [nightTasks, setNightTasks] = useState<Task[]>(() => {
    const stored = loadTasks();
    return stored.date === getTodayDateStr() ? stored.night : initialNightTasks;
  });
  const [reminderTimes, setReminderTimes] = useState<ReminderTimes>(() => loadPrefs() || initialReminderTimes);

  const [notification, setNotification] = useState<NotificationState>({
    isActive: false,
    type: null,
    startTime: null
  });
  const [hasPermission, setHasPermission] = useState(false);

  // Ref to keep track of active notification object
  const notifRef = useRef<Notification | null>(null);

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

  // Save tasks to localStorage whenever they change
  useEffect(() => {
    saveTasks(morningTasks, nightTasks);
  }, [morningTasks, nightTasks]);

  // Save preferences to localStorage whenever they change
  useEffect(() => {
    savePrefs(reminderTimes);
  }, [reminderTimes]);

  // Reset tasks at midnight
  useEffect(() => {
    const resetAtMidnight = () => {
      const now = new Date();
      const msUntilMidnight =
        new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 1).getTime() - now.getTime();
      setTimeout(() => {
        setMorningTasks(initialMorningTasks.map(t => ({ ...t, completed: false, completedBy: null, completedAt: null })));
        setNightTasks(initialNightTasks.map(t => ({ ...t, completed: false, completedBy: null, completedAt: null })));
      }, msUntilMidnight);
    };
    resetAtMidnight();
  }, [initialMorningTasks, initialNightTasks]);

  const checkTasksCompletion = useCallback((tasks: Task[]) => {
    return tasks.every(task => task.completed);
  }, []);

  // Trigger persistent notification
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
        requireInteraction: true,
        tag: `${type}-routine-${getTodayDateStr()}`
      });
      notifRef.current = notif;

      setNotification({
        isActive: true,
        type,
        startTime: new Date().toISOString()
      });

      notif.onclick = () => {
        window.focus();
      };

      notif.onclose = () => {
        notifRef.current = null;
      };
    }
  }, [morningTasks, nightTasks, hasPermission]);

  // Check for reminder times and trigger notification if needed
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const currentTime = now.toTimeString().slice(0, 5); // HH:MM

      // Morning
      if (
        currentTime === reminderTimes.morning &&
        !notification.isActive &&
        !checkTasksCompletion(morningTasks)
      ) {
        triggerPersistentNotification('morning');
      }
      // Night
      if (
        currentTime === reminderTimes.night &&
        !notification.isActive &&
        !checkTasksCompletion(nightTasks)
      ) {
        triggerPersistentNotification('evening');
      }
    };

    const interval = setInterval(checkTime, 1000 * 30); // Check every 30 seconds
    return () => clearInterval(interval);
  }, [
    reminderTimes,
    morningTasks,
    nightTasks,
    notification.isActive,
    triggerPersistentNotification,
    checkTasksCompletion
  ]);

  // Dismiss notification when all tasks are completed
  useEffect(() => {
    if (notification.isActive && notification.type) {
      const tasks = notification.type === 'morning' ? morningTasks : nightTasks;
      if (checkTasksCompletion(tasks)) {
        setNotification({
          isActive: false,
          type: null,
          startTime: null
        });
        if (notifRef.current) {
          notifRef.current.close();
          notifRef.current = null;
        }
      }
    }
  }, [morningTasks, nightTasks, notification, checkTasksCompletion]);

  // Manual dismissal
  const dismissNotification = useCallback(() => {
    if (notification.type) {
      setNotification({
        isActive: false,
        type: null,
        startTime: null
      });
      if (notifRef.current) {
        notifRef.current.close();
        notifRef.current = null;
      }
      return true;
    }
    return false;
  }, [notification.type]);

  // Task completion handlers
  const markTaskComplete = (type: 'morning' | 'evening', taskId: string) => {
    if (type === 'morning') {
      setMorningTasks(tasks =>
        tasks.map(t =>
          t.id === taskId ? { ...t, completed: true, completedBy: userName, completedAt: new Date().toISOString() } : t
        )
      );
    } else {
      setNightTasks(tasks =>
        tasks.map(t =>
          t.id === taskId ? { ...t, completed: true, completedBy: userName, completedAt: new Date().toISOString() } : t
        )
      );
    }
  };

  // User preferences update
  const updateReminderTimes = (times: ReminderTimes) => {
    setReminderTimes(times);
  };

  // Reset all tasks (for manual reset or testing)
  const resetAllTasks = () => {
    setMorningTasks(initialMorningTasks.map(t => ({ ...t, completed: false, completedBy: null, completedAt: null })));
    setNightTasks(initialNightTasks.map(t => ({ ...t, completed: false, completedBy: null, completedAt: null })));
  };

  return {
    notification,
    hasPermission,
    dismissNotification,
    triggerPersistentNotification,
    morningTasks,
    nightTasks,
    markTaskComplete,
    resetAllTasks,
    reminderTimes,
    updateReminderTimes
  };
};
