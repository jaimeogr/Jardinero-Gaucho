// useWorkgroupService.ts

import BackendService from '../backend/BackendService';
import LocalStorageService from '../localStorage/LocalStorageService';
import useWorkgroupStore from '../stores/useWorkgroupStore';
import { WorkgroupInterface, UserRole } from '../types/types';

const initializeWorkgroups = () => {
  const workgroups = BackendService.getMyWorgroups();
  useWorkgroupStore.getState().initializeWorkgroups(workgroups);
};

const getActiveWorkgroup = () => {
  const state = useWorkgroupStore.getState();
  return state.workgroups.find((wg) => wg.workgroupId === state.activeWorkgroupId);
};

const setActiveWorkgroup = (workgroupId?: string) => {
  const state = useWorkgroupStore.getState();
  let activeWorkgroupId = workgroupId;

  if (!activeWorkgroupId) {
    activeWorkgroupId = LocalStorageService.getLastUsedWorkgroup();
  }
  if (!activeWorkgroupId && state.workgroups.length > 0) {
    activeWorkgroupId = state.workgroups[0].workgroupId;
  }

  state.setActiveWorkgroup(activeWorkgroupId);

  return activeWorkgroupId;
};

const createWorkgroup = (workgroup: WorkgroupInterface) => {
  useWorkgroupStore.getState().addWorkgroup(workgroup);
};

const addUserToWorkgroup = (workgroupId: string, userId: string, role: UserRole) => {
  const workgroup = useWorkgroupStore.getState().getWorkgroupById(workgroupId);

  if (workgroup) {
    if (role === 'PrimaryOwner') {
      workgroup.primaryOwnerId = userId;
    } else if (role === 'Owner') {
      if (!workgroup.ownerIds.includes(userId)) {
        workgroup.ownerIds.push(userId);
      }
    } else if (role === 'Manager') {
      if (!workgroup.managerIds.includes(userId)) {
        workgroup.managerIds.push(userId);
      }
    } else if (role === 'Member') {
      if (!workgroup.memberIds.includes(userId)) {
        workgroup.memberIds.push(userId);
      }
    }

    useWorkgroupStore.getState().updateWorkgroup(workgroupId, workgroup);
  }
};

const removeUserFromWorkgroup = (workgroupId: string, userId: string) => {
  const workgroup = useWorkgroupStore.getState().getWorkgroupById(workgroupId);

  if (workgroup) {
    workgroup.ownerIds = workgroup.ownerIds.filter((id) => id !== userId);
    workgroup.managerIds = workgroup.managerIds.filter((id) => id !== userId);
    workgroup.memberIds = workgroup.memberIds.filter((id) => id !== userId);

    useWorkgroupStore.getState().updateWorkgroup(workgroupId, workgroup);
  }
};

const updateWorkgroupRoles = (workgroupId: string, userId: string, newRole: UserRole) => {
  // a special function is required for the moment when the primary owner is changed
  const workgroup = useWorkgroupStore.getState().getWorkgroupById(workgroupId);

  if (workgroup) {
    // Remove user from all roles
    workgroup.ownerIds = workgroup.ownerIds.filter((id) => id !== userId);
    workgroup.managerIds = workgroup.managerIds.filter((id) => id !== userId);
    workgroup.memberIds = workgroup.memberIds.filter((id) => id !== userId);

    // Assign new role
    if (newRole === 'Owner') {
      workgroup.ownerIds.push(userId);
    } else if (newRole === 'Manager') {
      workgroup.managerIds.push(userId);
    } else {
      workgroup.memberIds.push(userId);
    }

    useWorkgroupStore.getState().updateWorkgroup(workgroupId, workgroup);
  }
};

const useGetWorkgroupById = (workgroupId: string) => {
  return useWorkgroupStore((state) => state.workgroups.find((wg) => wg.workgroupId === workgroupId));
};

export default {
  initializeWorkgroups,
  createWorkgroup,
  addUserToWorkgroup,
  removeUserFromWorkgroup,
  updateWorkgroupRoles,
  useGetWorkgroupById,
  getActiveWorkgroup,
  setActiveWorkgroup,
};
