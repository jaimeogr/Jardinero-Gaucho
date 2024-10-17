import { create } from 'zustand';

import { WorkgroupInterface } from '../types/types';

interface WorkgroupStoreState {
  activeWorkgroupId: string | null;
  workgroups: WorkgroupInterface[];
  initializeWorkgroups: (workgroups: WorkgroupInterface[]) => void;
  setActiveWorkgroup: (workgroupId: string) => void;
  addWorkgroup: (workgroup: WorkgroupInterface) => void;
  updateWorkgroup: (
    workgroupId: string,
    updatedInfo: Partial<WorkgroupInterface>,
  ) => void;
  removeWorkgroup: (workgroupId: string) => void;
  getWorkgroupById: (workgroupId: string) => WorkgroupInterface | undefined;
}

const useWorkgroupStore = create<WorkgroupStoreState>((set, get) => ({
  activeWorkgroupId: null,
  workgroups: [],

  initializeWorkgroups: (workgroups: WorkgroupInterface[]) =>
    set({ workgroups }),

  setActiveWorkgroup: (workgroupId: string) =>
    set({ activeWorkgroupId: workgroupId }),

  addWorkgroup: (workgroup: WorkgroupInterface) =>
    set((state) => ({ workgroups: [...state.workgroups, workgroup] })),

  updateWorkgroup: (
    workgroupId: string,
    updatedInfo: Partial<WorkgroupInterface>,
  ) =>
    set((state) => ({
      workgroups: state.workgroups.map((wg) =>
        wg.workgroupId === workgroupId ? { ...wg, ...updatedInfo } : wg,
      ),
    })),

  removeWorkgroup: (workgroupId: string) =>
    set((state) => ({
      workgroups: state.workgroups.filter(
        (wg) => wg.workgroupId !== workgroupId,
      ),
    })),

  getWorkgroupById: (workgroupId: string) =>
    get().workgroups.find((wg) => wg.workgroupId === workgroupId),
}));

export default useWorkgroupStore;
