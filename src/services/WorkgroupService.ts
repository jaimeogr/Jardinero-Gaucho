import DatabaseService from './DatabaseService';
import useWorkgroupStore from '../stores/useWorkgroupStore';
import { WorkgroupInterface, UserRole } from '../types/types';

const createWorkgroup = (workgroup: WorkgroupInterface) => {
  useWorkgroupStore.getState().addWorkgroup(workgroup);
};

const addUserToWorkgroup = (
  workgroupId: string,
  userId: string,
  role: UserRole,
) => {
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

const updateWorkgroupRoles = (
  workgroupId: string,
  userId: string,
  newRole: UserRole,
) => {
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

const initializeWorkgroups = () => {
  const workgroups = DatabaseService.getMyWorgroups();
  useWorkgroupStore.getState().initializeWorkgroups(workgroups);
};

export default {
  initializeWorkgroups,
  createWorkgroup,
  addUserToWorkgroup,
  removeUserFromWorkgroup,
  updateWorkgroupRoles,
};
