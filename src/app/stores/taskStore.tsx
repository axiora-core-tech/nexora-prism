/**
 * Shared Task Store — tasks created from Sanctum flow to Tasks page
 * Uses localStorage for persistence across pages.
 */

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';

export interface SanctumTask {
  id: string;
  title: string;
  desc: string;
  status: 'active' | 'backlog' | 'review' | 'done';
  priority: 'high' | 'medium' | 'low';
  owner: string;
  ownerId: string;
  due: string;
  tags: string[];
  storyPoints: number;
  estimatedHours: number;
  loggedHours: number;
  parentId: string | null;
  source: 'sanctum' | 'manual';
  comments: any[];
  attachments: any[];
}

const STORAGE_KEY = 'prism_sanctum_tasks';

interface TaskStoreContextType {
  sanctumTasks: SanctumTask[];
  addTask: (task: SanctumTask) => void;
  removeTask: (id: string) => void;
  updateTask: (id: string, partial: Partial<SanctumTask>) => void;
}

const TaskStoreContext = createContext<TaskStoreContextType | null>(null);

export function TaskStoreProvider({ children }: { children: ReactNode }) {
  const [sanctumTasks, setSanctumTasks] = useState<SanctumTask[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch { return []; }
  });

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(sanctumTasks)); } catch {}
  }, [sanctumTasks]);

  const addTask = useCallback((task: SanctumTask) => {
    setSanctumTasks(prev => [...prev, task]);
  }, []);

  const removeTask = useCallback((id: string) => {
    setSanctumTasks(prev => prev.filter(t => t.id !== id));
  }, []);

  const updateTask = useCallback((id: string, partial: Partial<SanctumTask>) => {
    setSanctumTasks(prev => prev.map(t => t.id === id ? { ...t, ...partial } : t));
  }, []);

  return (
    <TaskStoreContext.Provider value={{ sanctumTasks, addTask, removeTask, updateTask }}>
      {children}
    </TaskStoreContext.Provider>
  );
}

export function useSanctumTasks() {
  const ctx = useContext(TaskStoreContext);
  if (!ctx) throw new Error('useSanctumTasks must be inside TaskStoreProvider');
  return ctx;
}
