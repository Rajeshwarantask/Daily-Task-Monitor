
import React, { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Task {
  id: string;
  text: string;
  completed: boolean;
  completedBy: string | null;
  completedAt: string | null;
}

interface TaskManagementProps {
  title: string;
  tasks: Task[];
  onUpdateTasks: (tasks: Task[]) => void;
  isDarkMode: boolean;
}

export const TaskManagement: React.FC<TaskManagementProps> = ({
  title,
  tasks,
  onUpdateTasks,
  isDarkMode
}) => {
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [newTaskText, setNewTaskText] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddTask = () => {
    if (newTaskText.trim()) {
      const newTask: Task = {
        id: Date.now().toString(),
        text: newTaskText.trim(),
        completed: false,
        completedBy: null,
        completedAt: null
      };
      onUpdateTasks([...tasks, newTask]);
      setNewTaskText('');
      setShowAddForm(false);
    }
  };

  const handleEditTask = (id: string, newText: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === id ? { ...task, text: newText } : task
    );
    onUpdateTasks(updatedTasks);
    setEditingId(null);
    setEditText('');
  };

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter(task => task.id !== id);
    onUpdateTasks(updatedTasks);
  };

  const startEdit = (task: Task) => {
    setEditingId(task.id);
    setEditText(task.text);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText('');
  };

  return (
    <div className={`bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-white/20 dark:border-slate-700/20`}>
      <div className="flex items-center justify-between mb-4">
        <h3 className={`text-lg font-semibold ${
          isDarkMode ? 'text-white' : 'text-slate-800'
        }`}>
          {title}
        </h3>
        <Button
          onClick={() => setShowAddForm(true)}
          size="sm"
          className="flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Add Task</span>
        </Button>
      </div>

      {showAddForm && (
        <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
          <Label className={isDarkMode ? 'text-slate-200' : 'text-slate-700'}>
            New Task
          </Label>
          <div className="flex space-x-2 mt-2">
            <Input
              value={newTaskText}
              onChange={(e) => setNewTaskText(e.target.value)}
              placeholder="Enter task description"
              onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
            />
            <Button onClick={handleAddTask} size="sm">
              <Save className="w-4 h-4" />
            </Button>
            <Button
              onClick={() => {
                setShowAddForm(false);
                setNewTaskText('');
              }}
              variant="outline"
              size="sm"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-3">
        {tasks.map((task) => (
          <div
            key={task.id}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              isDarkMode
                ? 'bg-slate-700/50 border-slate-600'
                : 'bg-slate-50 border-slate-200'
            }`}
          >
            {editingId === task.id ? (
              <div className="flex items-center space-x-2 flex-1">
                <Input
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleEditTask(task.id, editText)}
                  className="flex-1"
                />
                <Button
                  onClick={() => handleEditTask(task.id, editText)}
                  size="sm"
                >
                  <Save className="w-4 h-4" />
                </Button>
                <Button onClick={cancelEdit} variant="outline" size="sm">
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <>
                <span className={`flex-1 ${
                  isDarkMode ? 'text-slate-200' : 'text-slate-800'
                }`}>
                  {task.text}
                </span>
                <div className="flex items-center space-x-2">
                  <Button
                    onClick={() => startEdit(task)}
                    variant="ghost"
                    size="sm"
                  >
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={() => handleDeleteTask(task.id)}
                    variant="ghost"
                    size="sm"
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
