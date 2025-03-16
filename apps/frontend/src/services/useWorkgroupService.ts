// useWorkgroupService.ts

import { getUserWorkgroupsWithRoles, insertWorkgroup } from '@/api/supabase/endpoints';
import LocalStorageService from '@/localStorage/LocalStorageService';
import useWorkgroupStore from '@/stores/useWorkgroupStore';
import { WorkgroupInterface, UserRole } from '@/types/types';

const initializeWorkgroups = async (userId: string) => {
  console.log('Initializing workgroups for user:', userId);
  const workgroups = await getUserWorkgroupsWithRoles(userId);
  useWorkgroupStore.getState().initializeWorkgroups(workgroups);
};

const useAllWorkgroups = () => {
  const workgroups = useWorkgroupStore((state) => state.workgroups);
  return workgroups;
};

const getActiveWorkgroup = () => {
  const state = useWorkgroupStore.getState();
  return state.workgroups.find((wg) => wg.workgroupId === state.activeWorkgroupId);
};

const setActiveWorkgroup = async (workgroupId?: string): Promise<string | undefined> => {
  const state = useWorkgroupStore.getState();
  let newActiveWorkgroupId = workgroupId;

  // If no workgroupId is provided, try to retrieve it from local storage.
  if (!newActiveWorkgroupId) {
    newActiveWorkgroupId = await LocalStorageService.getLastActiveWorkgroup();
    if (newActiveWorkgroupId && !state.workgroups.some((wg) => wg.workgroupId === newActiveWorkgroupId)) {
      // Clear the active workgroup if it is not found in the list of available workgroups.
      // This will help avoid inconsistencies between local storage and the database.
      newActiveWorkgroupId = undefined;
    }
  }

  // Fallback to the available workgroup, if exactly only one exists.
  if (!newActiveWorkgroupId && state.workgroups.length === 1) {
    newActiveWorkgroupId = state.workgroups[0].workgroupId;
  }

  if (newActiveWorkgroupId) {
    // Update state and persist the active workgroup.
    state.setActiveWorkgroup(newActiveWorkgroupId);
    await LocalStorageService.setLastActiveWorkgroup(newActiveWorkgroupId);
  }

  console.log('Active workgroup set to:', newActiveWorkgroupId);
  return newActiveWorkgroupId;
};

const createWorkgroup = async (workgroupName: string) => {
  const newWG = await insertWorkgroup(workgroupName);
  return newWG;
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

const deleteWorkgroupById = (workgroupId: string) => {
  // TODO: Implement this function
  // delete from database and localstorage too
  console.error('oops, function is not implemented yet.');
};

export default {
  initializeWorkgroups,
  useAllWorkgroups,
  createWorkgroup,
  addUserToWorkgroup,
  removeUserFromWorkgroup,
  updateWorkgroupRoles,
  useGetWorkgroupById,
  getActiveWorkgroup,
  setActiveWorkgroup,
  deleteWorkgroupById,
};
