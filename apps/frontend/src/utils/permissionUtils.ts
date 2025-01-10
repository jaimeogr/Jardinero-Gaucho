import { WorkgroupInterface, UserRole } from '../types/types';

export const userHasPermission = (workgroup: WorkgroupInterface, userId: string, requiredRole: UserRole) => {
  if (requiredRole === 'PrimaryOwner') {
    return workgroup.primaryOwnerId.includes(userId);
  } else if (requiredRole === 'Owner') {
    return workgroup.primaryOwnerId.includes(userId) || workgroup.ownerIds.includes(userId);
  } else if (requiredRole === 'Manager') {
    return (
      workgroup.primaryOwnerId.includes(userId) ||
      workgroup.ownerIds.includes(userId) ||
      workgroup.managerIds.includes(userId)
    );
  } else if (requiredRole === 'Member') {
    return (
      workgroup.primaryOwnerId.includes(userId) ||
      workgroup.ownerIds.includes(userId) ||
      workgroup.managerIds.includes(userId) ||
      workgroup.memberIds.includes(userId)
    );
  } else {
    return false;
  }
};
