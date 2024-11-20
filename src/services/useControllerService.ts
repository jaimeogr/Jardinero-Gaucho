// src/services/useControllerService.ts

import { v4 as uuidv4 } from 'uuid'; //ID Generator

import {
  NeighbourhoodData,
  UserRole,
  LotInterface,
  ZoneData,
  UserInterface,
  UserInActiveWorkgroupWithRole,
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

const getLotById = (lotId: string) => {
  return useLotService.getLotById(lotId);
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

const inviteUserToActiveWorkgroup = (
  email: string,
  role: UserRole,
  accessToAllLots: boolean,
): UserInterface | null => {
  const userId = uuidv4();
  const activeWorkgroup = getActiveWorkgroup();
  if (!activeWorkgroup) {
    console.error('No active workgroup found.');
    return null;
  }

  const newUser: UserInterface = {
    userId,
    email,
    firstName: '', // Since we only have the email at this point
    lastName: '',
    workgroupAssignments: [
      {
        workgroupId: activeWorkgroup.workgroupId,
        role,
        accessToAllLots,
        hasAcceptedPresenceInWorkgroup: false,
      },
    ],
  };
  // Add user to user store
  useUserService.addUser(newUser);
  return newUser;
};

const updateUserInActiveWorkgroup = (
  userId: string,
  newRole: UserRole,
  accessToAllLots: boolean,
) => {
  const user = useUserService.getUserById(userId);
  if (!user) return false;

  const activeWorkgroupId = getActiveWorkgroup()?.workgroupId;
  if (!activeWorkgroupId) return false;

  const assignmentIndex = user.workgroupAssignments.findIndex(
    (assignment) => assignment.workgroupId === activeWorkgroupId,
  );
  if (assignmentIndex >= 0) {
    user.workgroupAssignments[assignmentIndex].role = newRole;
    user.workgroupAssignments[assignmentIndex].accessToAllLots =
      accessToAllLots;
  } else {
    // Since the user doesn't have an assignment in the active workgroup,
    // we should not proceed with the update.
    console.error(
      `Cannot update user ${userId}: No assignment found in active workgroup ${activeWorkgroupId}.`,
    );
    return false;
  }

  useUserService.updateUser(userId, user);
  return true;
};

const getUserInActiveWorkgroupWithRole = (
  userId: string,
): UserInActiveWorkgroupWithRole | null => {
  const activeWorkgroupId = getActiveWorkgroup()?.workgroupId;
  if (!activeWorkgroupId) return null;

  const user = useUserService.getUserById(userId);
  if (!user) return null;

  const assignment = user.workgroupAssignments.find(
    (wa) => wa.workgroupId === activeWorkgroupId,
  );
  if (assignment) {
    // the user is in the active workgroup
    const assignedZonesCount =
      useLotService.getNumberOfAssignedZonesForUserInSpecificWorkgroup(
        activeWorkgroupId,
        user.userId,
      );
    const assignedLotsCount =
      useLotService.getNumberOfAssignedLotsForUserInSpecificWorkgroup(
        activeWorkgroupId,
        user.userId,
      );
    return {
      ...user,
      ...assignment,
      assignedZonesCount: assignedZonesCount,
      assignedLotsCount: assignedLotsCount,
    };
  }
  return null;
};

const getUsersInActiveWorkgroupWithRoles =
  (): UserInActiveWorkgroupWithRole[] => {
    const activeWorkgroupId = getActiveWorkgroup()?.workgroupId;
    if (!activeWorkgroupId) return [];

    const allUsers = useUserService.useAllUsers();
    const usersInWorkgroup = allUsers
      .map((user) => {
        return getUserInActiveWorkgroupWithRole(user.userId);
      })
      .filter((user) => user !== null) as UserInActiveWorkgroupWithRole[];

    // Sort by role priority: PrimaryOwner > Owner > Manager > Member
    const usersSortedByRole = usersInWorkgroup.sort((a, b) => {
      const rolePriority = { PrimaryOwner: 1, Owner: 2, Manager: 3, Member: 4 };
      return rolePriority[a.role] - rolePriority[b.role];
    });

    return usersSortedByRole;
  };

const toggleLotSelection = (lotId: string, newState: boolean) => {
  useLotService.toggleLotSelection(lotId, newState);
};

const toggleZoneSelection = (zoneId: string, newState: boolean) => {
  useLotService.toggleZoneSelection(zoneId, newState);
};

const toggleNeighbourhoodSelection = (
  neighbourhoodId: string,
  newState: boolean,
) => {
  useLotService.toggleNeighbourhoodSelection(neighbourhoodId, newState);
};

const deselectAllLots = () => {
  useLotService.deselectAllLots();
};

const preselectAssignedZonesInWorkgroupForUser = (userId: string) => {
  const activeWorkgroupId = getActiveWorkgroup()?.workgroupId;
  if (!activeWorkgroupId) return null;
  useLotService.preselectAssignedZonesInWorkgroupForUser(
    userId,
    activeWorkgroupId,
  );
};

const updateZoneAssignmentsForMember = (userId: string) => {
  const activeWorkgroupId = getActiveWorkgroup()?.workgroupId;
  if (!activeWorkgroupId) return null;
  useLotService.updateZoneAssignmentsForMemberInWorkgroup(
    userId,
    activeWorkgroupId,
  );
};

const selectAllZones = (): boolean => {
  const activeWorkgroupId = getActiveWorkgroup()?.workgroupId;
  if (!activeWorkgroupId) return false;
  return useLotService.selectAllZones(activeWorkgroupId);
};

export default {
  initializeServices,
  getLotById,
  createLot,
  markLotCompletedForSpecificDate,
  markSelectedLotsCompletedForSpecificDate,
  useCheckUserHasPermission,
  getNeighbourhoodsAndZones,
  addZoneToNeighbourhood,
  addNeighbourhood,
  inviteUserToActiveWorkgroup,
  updateUserInActiveWorkgroup,
  getUserInActiveWorkgroupWithRole,
  getUsersInActiveWorkgroupWithRoles,
  toggleLotSelection,
  toggleZoneSelection,
  toggleNeighbourhoodSelection,
  deselectAllLots,
  preselectAssignedZonesInWorkgroupForUser,
  updateZoneAssignmentsForMember,
  selectAllZones,
};
