// src/services/useControllerService.ts

import React from 'react';
import { v4 as uuidv4 } from 'uuid'; //ID Generator

import BackendService from '../backend/BackendService';
import useLotService from '../services/useLotService';
import useUserService from '../services/useUserService';
import useWorkgroupService from '../services/useWorkgroupService';
import {
  NeighbourhoodData,
  UserRole,
  LotInterface,
  ZoneData,
  UserInterface,
  UserInActiveWorkgroupWithRole,
  TemporaryUserData,
  NestedLotsWithIndicatorsInterface,
} from '../types/types';
import { userHasPermission } from '../utils/permissionUtils';

const initializeServices = () => {
  useLotService.initializeStore();
  useUserService.initializeUsers();
  useWorkgroupService.initializeWorkgroups();
  setActiveWorkgroup('1');
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

const useNeighbourhoodsAndZones = (): NeighbourhoodData[] => {
  // returns all neighbourhoods and zones for the active workgroup
  const activeWorkgroup = getActiveWorkgroup()?.workgroupId;
  if (!activeWorkgroup) {
    console.error('No active workgroup found.');
    return [];
  }
  return useLotService.useNeighbourhoodsAndZones(activeWorkgroup);
};

const setActiveWorkgroup = (workgroupId: string) => {
  useWorkgroupService.setActiveWorkgroup(workgroupId);
};

const getActiveWorkgroup = () => {
  const activeWorkgroup = useWorkgroupService.getActiveWorkgroup();
  console.log('Active Workgroup:', activeWorkgroup);
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

const useUsersInActiveWorkgroupWithRoles =
  (): UserInActiveWorkgroupWithRole[] => {
    const activeWorkgroup = getActiveWorkgroup();
    const activeWorkgroupId = activeWorkgroup?.workgroupId;

    // Subscribe to users
    const allUsers = useUserService.useAllUsers();

    // Get assigned counts per user from useLotService
    const assignedZonesByUser =
      useLotService.useAssignedZonesCountPerUserInWorkgroup(activeWorkgroupId);
    const assignedLotsByUser =
      useLotService.useAssignedLotsCountPerUserInWorkgroup(activeWorkgroupId);

    return React.useMemo(() => {
      if (!activeWorkgroupId) {
        // Handle the case when activeWorkgroupId is undefined
        return [];
      }

      const usersInWorkgroup = allUsers
        .map((user) => {
          const assignment = user.workgroupAssignments.find(
            (wa) => wa.workgroupId === activeWorkgroupId,
          );
          if (assignment) {
            const assignedZonesCount = assignedZonesByUser[user.userId] || 0;
            const assignedLotsCount = assignedLotsByUser[user.userId] || 0;

            return {
              ...user,
              ...assignment,
              assignedZonesCount,
              assignedLotsCount,
            };
          }
          return null;
        })
        .filter((user) => user !== null) as UserInActiveWorkgroupWithRole[];

      // Sort users by role priority
      const usersSortedByRole = usersInWorkgroup.sort((a, b) => {
        const rolePriority = {
          PrimaryOwner: 1,
          Owner: 2,
          Manager: 3,
          Member: 4,
        };
        return rolePriority[a.role] - rolePriority[b.role];
      });

      return usersSortedByRole;
    }, [activeWorkgroupId, allUsers, assignedZonesByUser, assignedLotsByUser]);
  };

const toggleLotSelection = (
  screen: string,
  lotId: string,
  newState: boolean,
) => {
  useLotService.toggleLotSelection(screen, lotId, newState);
};

const toggleZoneSelection = (
  screen: string,
  zoneId: string,
  newState: boolean,
) => {
  useLotService.toggleZoneSelection(screen, zoneId, newState);
};

const toggleNeighbourhoodSelection = (
  screen: string,
  neighbourhoodId: string,
  newState: boolean,
) => {
  useLotService.toggleNeighbourhoodSelection(screen, neighbourhoodId, newState);
};

const deselectAllLots = (screen: string) => {
  useLotService.deselectAllLots(screen);
};

const updateZoneAssignmentsForMember = (
  screen: string,
  userId: string,
  accessToAllLots: boolean,
) => {
  const activeWorkgroupId = getActiveWorkgroup()?.workgroupId;
  if (!activeWorkgroupId) return null;

  if (accessToAllLots) {
    // Update the user's accessToAllLots setting
    useUserService.updateUserAccessToAllLots(
      userId,
      accessToAllLots,
      activeWorkgroupId,
    );
    // Clear any existing zone assignments since the user now has access to all zones
    useLotService.clearZoneAssignmentsForMemberInWorkgroup(
      userId,
      activeWorkgroupId,
    );
  } else {
    useLotService.updateZoneAssignmentsForMemberInWorkgroupUsingSelection(
      userId,
      activeWorkgroupId,
    );
  }
  deselectAllLots(screen);
};

const toggleNeighbourhoodExpansion = (neighbourhoodId: string) => {
  useLotService.toggleNeighbourhoodExpansion(neighbourhoodId);
};

const toggleZoneExpansion = (zoneId: string) => {
  useLotService.toggleZoneExpansion(zoneId);
};

const useNestedLots = (screen: string): NestedLotsWithIndicatorsInterface => {
  console.log('inside useNestedLots');

  const activeWorkgroupId = getActiveWorkgroup()?.workgroupId;

  console.log('useNestedLots', screen, activeWorkgroupId);

  return useLotService.useNestedLots(screen, activeWorkgroupId);
};

export default {
  initializeServices,

  // Lots, zones, neighbourhoods
  useNestedLots,
  getLotById,
  createLot,
  markLotCompletedForSpecificDate,
  markSelectedLotsCompletedForSpecificDate,
  useCheckUserHasPermission,
  useNeighbourhoodsAndZones,
  addZoneToNeighbourhood,
  addNeighbourhood,

  // users, workgroups and zone assignments
  updateUserInActiveWorkgroup,
  useUsersInActiveWorkgroupWithRoles,
  updateZoneAssignmentsForMember,

  // selections
  deselectAllLots,
  toggleLotSelection,
  toggleZoneSelection,
  toggleNeighbourhoodSelection,

  // Expanded and collapsed accordions
  toggleZoneExpansion,
  toggleNeighbourhoodExpansion,
  collapseAllZones: useLotService.collapseAllZones,
  expandAllNeighbourhoods: useLotService.expandAllNeighbourhoods,
  collapseAllNeighbourhoods: useLotService.collapseAllNeighbourhoods,
};
