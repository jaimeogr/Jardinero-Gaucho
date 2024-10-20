import {
  NeighbourhoodData,
  UserRole,
  LotInterface,
  ZoneData,
} from './../types/types';
import useLotService from './useLotService';
import useUserService from './useUserService';
import useWorkgroupService from './useWorkgroupService';
import BackendService from '../backend/BackendService';
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

const createLot = (lot: Partial<LotInterface>) => {
  const workgroupId = getActiveWorkgroup()?.workgroupId;
  useLotService.createLot(workgroupId, lot);
  return true;
};

const addNeighbourhood = (neighbourhoodLabel: string): NeighbourhoodData => {
  const activeWorkgroup = getActiveWorkgroup()?.workgroupId;
  return useLotService.addNeighbourhood(activeWorkgroup, neighbourhoodLabel);
};

const addZoneToNeighbourhood = (
  neighbourhoodId: string,
  zoneLabel: string,
): ZoneData => {
  return useLotService.addZoneToNeighbourhood(neighbourhoodId, zoneLabel);
};

const getNeighbourhoodsAndZones = () => {
  const activeWorkgroup = getActiveWorkgroup()?.workgroupId;
  if (!activeWorkgroup) {
    console.error('No active workgroup found.');
    return { neighbourhoods: [] };
  }
  return useLotService.useNeighbourhoodsAndZones(activeWorkgroup);
};

const getActiveWorkgroup = () => {
  const activeWorkgroup = useWorkgroupService.getOrSetActiveWorkgroup();
  return activeWorkgroup;
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
