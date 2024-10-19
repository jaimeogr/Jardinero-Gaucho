import useLotService from './useLotService';
import useUserService from './useUserService';
import useWorkgroupService from './useWorkgroupService';
import BackendService from '../backend/BackendService';
import {
  UserRole,
  LotInterface,
  NeighbourhoodData,
  ZoneData,
} from '../types/types';
import { userHasPermission } from '../utils/permissionUtils';

const initializeServices = () => {
  useLotService.initializeStore();
  useUserService.initializeUsers();
  useWorkgroupService.initializeWorkgroups();
};

const markLotCompletedForSpecificDate = (lotId: string, date?: Date) => {
  useLotService.markLotCompletedForSpecificDate(lotId, date);
};

const markSelectedLotsCompletedForSpecificDate = (date?: Date) => {
  return useLotService.markSelectedLotsCompletedForSpecificDate(date);
};

const createLot = (lot: LotInterface) => {
  useLotService.createLot(lot);
  return true;
};

const addNeighbourhood = (neighbourhood: NeighbourhoodData) => {
  useLotService.addNeighbourhood(neighbourhood);
};

const addZoneToNeighbourhood = (neighbourhoodId: string, zone: ZoneData) => {
  useLotService.addZoneToNeighbourhood(neighbourhoodId, zone);
};

const getNeighbourhoodsAndZones = () => {
  const activeWorkgroup = useWorkgroupService.getOrSetActiveWorkgroup();
  if (!activeWorkgroup) {
    console.error('No active workgroup found.');
    return { neighbourhoods: [] };
  }
  return useLotService.useNeighbourhoodsAndZones(activeWorkgroup.workgroupId);
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
  createLot,
  markLotCompletedForSpecificDate,
  markSelectedLotsCompletedForSpecificDate,
  useCheckUserHasPermission,
  getNeighbourhoodsAndZones,
  addZoneToNeighbourhood,
  addNeighbourhood,
};
