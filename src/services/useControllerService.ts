import useLotService from './useLotService';
import useUserService from './useUserService';
import useWorkgroupService from './useWorkgroupService';
import BackendService from '../backend/BackendService';
import { UserRole } from '../types/types';
import { userHasPermission } from '../utils/permissionUtils';

const initializeServices = () => {
  useLotService.initializeLots();
  useUserService.initializeUsers();
  useWorkgroupService.initializeWorkgroups();
};

const markLotCompletedForSpecificDate = (lotId: string, date?: Date) => {
  useLotService.markLotCompletedForSpecificDate(lotId, date);
};

const markSelectedLotsCompletedForSpecificDate = (date?: Date) => {
  return useLotService.markSelectedLotsCompletedForSpecificDate(date);
};

const useCheckUserHasPermission = (requiredRole: UserRole) => {
  const currentUserId = useUserService.useGetCurrentUser()?.userId;
  if (!currentUserId) {
    console.error('Current user not found.');
    return false;
  }

  const workgroup = useWorkgroupService.useGetWorkgroupById(currentUserId);
  if (!workgroup) {
    console.error('Workgroup not found for the current user.');
    return false;
  }

  return userHasPermission(workgroup, currentUserId, requiredRole);
};

export default {
  initializeServices,
  markLotCompletedForSpecificDate,
  markSelectedLotsCompletedForSpecificDate,
  useCheckUserHasPermission,
};
