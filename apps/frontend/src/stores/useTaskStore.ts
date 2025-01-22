//useTaskStore
import { create } from 'zustand';

import { TaskInterface } from '@/types/types';

interface TaskStoreState {
  tasks: TaskInterface[];
  addTask: (task: TaskInterface) => void;
  initializeTasks: (tasks: TaskInterface[]) => void;
  getTasksByWorkgroupId: (workgroupId: string) => TaskInterface[];
  getTasksByLotId: (lotId: string) => TaskInterface[];
  updateTask: (taskId: string, updatedInfo: Partial<TaskInterface>) => void;
  removeTask: (taskId: string) => void;
}

const useTaskStore = create<TaskStoreState>((set, get) => ({
  tasks: [],

  addTask: (task: TaskInterface) => set((state) => ({ tasks: [...state.tasks, task] })),

  initializeTasks: (tasks: TaskInterface[]) => set({ tasks }),

  getTasksByWorkgroupId: (workgroupId: string) => get().tasks.filter((task) => task.workgroupId === workgroupId),

  getTasksByLotId: (lotId: string) => get().tasks.filter((task) => task.lotId === lotId),

  updateTask: (taskId: string, updatedInfo: Partial<TaskInterface>) => {
    set((state) => ({
      tasks: state.tasks.map((task) => (task.taskId === taskId ? { ...task, ...updatedInfo } : task)),
    }));
  },

  removeTask: (taskId: string) => {
    set((state) => ({
      tasks: state.tasks.filter((task) => task.taskId !== taskId),
    }));
  },
}));

export default useTaskStore;
