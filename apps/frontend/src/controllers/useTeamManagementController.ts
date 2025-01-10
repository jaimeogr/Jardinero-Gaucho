// useTeamManagementController.ts
import React from 'react';
import { v4 as uuidv4 } from 'uuid'; //ID Generator

import useLotService from '../services/useLotService';
import useUserService from '../services/useUserService';
import useLotStore from '../stores/useLotStore';
import useUserStore from '../stores/useUserStore';
import useWorkgroupStore from '../stores/useWorkgroupStore';
import useZoneAssignmentScreenStore from '../stores/useZoneAssignmentScreenStore';
import {
  LotInStore,
  NeighbourhoodData,
  NestedLotsWithIndicatorsInterface,
  UserInActiveWorkgroupWithRole,
  TemporaryUserData,
  UserRole,
  UserInterface,
} from '../types/types';
import { ITeamManagementController } from './../types/controllerTypes';

const useTeamManagementController = (): ITeamManagementController => {
  const activeWorkgroupId = useWorkgroupStore((state) => state.activeWorkgroupId);
  const lots: LotInStore[] = useLotStore((state) => state.lots);
  const neighbourhoodsWithZones: NeighbourhoodData[] = useLotStore(
    (state) => state.neighbourhoodZoneData.neighbourhoods,
  );
  const selectedLots: Set<string> = useZoneAssignmentScreenStore((state) => state.selectedLots);
  const expandedZones: Set<string> = useZoneAssignmentScreenStore((state) => state.expandedZones);
  const expandedNeighbourhoods: Set<string> = useZoneAssignmentScreenStore((state) => state.expandedNeighbourhoods);

  const users = useUserStore((state) => state.users);
  const currentUser = useUserStore((state) => state.currentUser);

  const useNestedLots = (): NestedLotsWithIndicatorsInterface => {
    const nestedLots = React.useMemo<NestedLotsWithIndicatorsInterface>(() => {
      return useLotService.computeNestedLots(
        activeWorkgroupId,
        lots,
        neighbourhoodsWithZones,
        selectedLots,
        expandedZones,
        expandedNeighbourhoods,
      );
    }, [activeWorkgroupId, lots, neighbourhoodsWithZones, selectedLots, expandedZones, expandedNeighbourhoods]);
    return nestedLots;
  };

  const nestedLotsData = useNestedLots(); // this must be under the declaration of useNestedLots

  const toggleLotSelection = (lotId: string, newState: boolean) => {
    return; // ill leave this implemented but empty to comply with the React functional component for now, could be removed in the future
  };

  const toggleZoneSelection = (zoneId: string, newState: boolean) => {
    const lotIdsForZone = lots.filter((lot) => lot.zoneId === zoneId).map((lot) => lot.lotId);

    useZoneAssignmentScreenStore.getState().toggleSelectionForLotsArray(lotIdsForZone, newState);
  };

  const toggleNeighbourhoodSelection = (neighbourhoodId: string, newState: boolean) => {
    const lotIdsForNeighbourhood = lots
      .filter((lot) => lot.neighbourhoodId === neighbourhoodId)
      .map((lot) => lot.lotId);

    useZoneAssignmentScreenStore.getState().toggleSelectionForLotsArray(lotIdsForNeighbourhood, newState);
  };

  const deselectAllLots = () => {
    useZoneAssignmentScreenStore.getState().deselectAllLots();
  };

  const toggleZoneExpansion = (zoneId: string) => {
    useZoneAssignmentScreenStore.getState().toggleZoneExpansion(zoneId);
  };

  const collapseAllZones = () => {
    useZoneAssignmentScreenStore.getState().collapseAllZones();
  };

  const toggleNeighbourhoodExpansion = (neighbourhoodId: string) => {
    useZoneAssignmentScreenStore.getState().toggleNeighbourhoodExpansion(neighbourhoodId);
  };

  const collapseAllNeighbourhoods = () => {
    useZoneAssignmentScreenStore.getState().collapseAllNeighbourhoods();
  };

  const expandAllNeighbourhoods = () => {
    const neighbourhoodIds = neighbourhoodsWithZones.map((n) => n.neighbourhoodId);
    useZoneAssignmentScreenStore.getState().expandAllNeighbourhoods(neighbourhoodIds);
  };

  const useUsersInActiveWorkgroupWithRoles = (): UserInActiveWorkgroupWithRole[] => {
    return React.useMemo(() => {
      if (!activeWorkgroupId) {
        // Handle the case when activeWorkgroupId is undefined
        return [];
      }

      // Get assigned counts per user from useLotService
      const assignedZonesByUser = useUserService.computeAssignedZonesCountPerUserInWorkgroup(
        activeWorkgroupId,
        users,
        neighbourhoodsWithZones,
      );
      const assignedLotsByUser = useUserService.computeAssignedLotsCountPerUserInWorkgroup(
        activeWorkgroupId,
        users,
        lots,
      );

      const usersInWorkgroup = users
        .map((user) => {
          const assignment = user.workgroupAssignments.find((wa) => wa.workgroupId === activeWorkgroupId);
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
    }, [activeWorkgroupId, users, lots, neighbourhoodsWithZones]);
  };

  const useUserInActiveWorkgroupWithRole = (userId: string): UserInActiveWorkgroupWithRole | null => {
    // Reuse the memoized array of users in the active workgroup
    const usersInWorkgroupWithRoles = useUsersInActiveWorkgroupWithRoles();

    // Find the user by userId in the already computed array
    const userWithRole = usersInWorkgroupWithRoles.find((user) => user.userId === userId);

    return userWithRole || null;
  };

  const updateZoneAssignmentsAndRoleForUser = (userId: string, accessToAllLots: boolean, role: UserRole) => {
    // Find the user to ensure we can update their assignments
    const user = users.find((u) => u.userId === userId);
    if (!user) {
      console.warn(`User with ID ${userId} not found.`);
      return;
    }

    // Compute the updated assignment information
    const updatedWorkgroupAssignments = useUserService.updateUserAccessAndRole(
      user,
      accessToAllLots,
      role,
      activeWorkgroupId,
      nestedLotsData.nestedLots,
    );

    if (!updatedWorkgroupAssignments) {
      console.warn('Failed to update user access.');
    } else {
      // Update the user in the store with the new assignments
      useUserStore.getState().updateUser(userId, {
        workgroupAssignments: updatedWorkgroupAssignments,
      });
    }

    // Clear any currently selected lots after updating assignments
    deselectAllLots();
  };

  const selectAssignedZonesForUser = (userId: string) => {
    if (!activeWorkgroupId) {
      console.warn('No active workgroup is set.');
      return;
    }

    // Find the user
    const user = users.find((u) => u.userId === userId);
    if (!user) {
      console.warn(`User with ID ${userId} not found.`);
      return;
    }

    // Find the user's assignment for the active workgroup
    const workgroupAssignment = user.workgroupAssignments.find((wa) => wa.workgroupId === activeWorkgroupId);
    if (!workgroupAssignment) {
      console.warn(`User with ID ${userId} is not assigned to the active workgroup.`);
      return;
    }

    // Create sets for quick lookup
    const assignedZoneIds = new Set(workgroupAssignment.assignedZones);
    const assignedNeighbourhoodIds = new Set(workgroupAssignment.assignedNeighbourhoods);

    // Filter lots to only those that belong to the assigned zones or neighbourhoods
    const lotsToSelect = lots
      .filter((lot) => assignedZoneIds.has(lot.zoneId) || assignedNeighbourhoodIds.has(lot.neighbourhoodId))
      .map((lot) => lot.lotId);

    // Select the filtered lots
    if (lotsToSelect.length > 0) {
      useZoneAssignmentScreenStore.getState().toggleSelectionForLotsArray(lotsToSelect, true);
    }
  };

  const inviteUserToActiveWorkgroup = (
    email: string,
    role: UserRole,
    accessToAllLots: boolean,
  ): UserInterface | null => {
    const userId = uuidv4();
    if (!activeWorkgroupId) {
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
          workgroupId: activeWorkgroupId,
          role,
          accessToAllLots,
          hasAcceptedPresenceInWorkgroup: false,
          assignedNeighbourhoods: [],
          assignedZones: [],
        },
      ],
    };
    // Add user to user store
    useUserService.addUser(newUser);
    return newUser;
  };

  const getTemporaryUserData = (): {
    temporaryUserData: TemporaryUserData | null;
    temporaryisNewUser: boolean;
  } => {
    return useUserService.getTemporaryUserData();
  };

  const setTemporaryUserData = (userData: TemporaryUserData | null, isNewUser: boolean) => {
    useUserService.setTemporaryUserData(userData, isNewUser);
  };

  return {
    // Lots
    useNestedLots,

    // Team management
    inviteUserToActiveWorkgroup,
    updateZoneAssignmentsAndRoleForUser,
    selectAssignedZonesForUser,
    useUserInActiveWorkgroupWithRole,
    useUsersInActiveWorkgroupWithRoles,

    // selections
    deselectAllLots,
    toggleLotSelection,
    toggleZoneSelection,
    toggleNeighbourhoodSelection,

    // Expanded and collapsed accordions
    toggleZoneExpansion,
    toggleNeighbourhoodExpansion,
    collapseAllZones,
    expandAllNeighbourhoods,
    collapseAllNeighbourhoods,

    // temporary user data for navigation purposes
    getTemporaryUserData,
    setTemporaryUserData,
  };
};

export default useTeamManagementController;
