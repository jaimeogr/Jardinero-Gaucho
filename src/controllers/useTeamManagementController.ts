// useTeamManagementController.ts
import React from 'react';

import useLotService from '../services/useLotService';
import useUserService from '../services/useUserService';
import useLotStore from '../stores/useLotStore';
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
  const { toggleSelectionForSingleLot, toggleSelectionForLotsArray } =
    useZoneAssignmentScreenStore();

  const workgroupId = useWorkgroupStore((state) => state.activeWorkgroupId);
  const lots: LotInStore[] = useLotStore((state) => state.lots);
  const neighbourhoodsWithZones: NeighbourhoodData[] = useLotStore(
    (state) => state.neighbourhoodZoneData.neighbourhoods,
  );
  const selectedLots: Set<string> = useZoneAssignmentScreenStore(
    (state) => state.selectedLots,
  );
  const expandedZones: Set<string> = useZoneAssignmentScreenStore(
    (state) => state.expandedZones,
  );
  const expandedNeighbourhoods: Set<string> = useZoneAssignmentScreenStore(
    (state) => state.expandedNeighbourhoods,
  );

  const toggleZoneSelection = (zoneId: string, newState: boolean) => {
    const currentLots = useLotStore.getState().lots; // without this way of accessing the lots the app doesnt work correctly.
    const lotIdsForZone = currentLots
      .filter((lot) => lot.zoneId === zoneId)
      .map((lot) => lot.lotId);

    useZoneAssignmentScreenStore
      .getState()
      .toggleSelectionForLotsArray(lotIdsForZone, newState);
  };

  const toggleNeighbourhoodSelection = (
    neighbourhoodId: string,
    newState: boolean,
  ) => {
    const currentLots = useLotStore.getState().lots; // without this way of accessing the lots the app doesnt work correctly.
    const lotIdsForNeighbourhood = currentLots
      .filter((lot) => lot.neighbourhoodId === neighbourhoodId)
      .map((lot) => lot.lotId);

    useZoneAssignmentScreenStore
      .getState()
      .toggleSelectionForLotsArray(lotIdsForNeighbourhood, newState);
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
    useZoneAssignmentScreenStore
      .getState()
      .toggleNeighbourhoodExpansion(neighbourhoodId);
  };

  const collapseAllNeighbourhoods = () => {
    useZoneAssignmentScreenStore.getState().collapseAllNeighbourhoods();
  };

  const expandAllNeighbourhoods = () => {
    const neighbourhoodIds = neighbourhoodsWithZones.map(
      (n) => n.neighbourhoodId,
    );
    useZoneAssignmentScreenStore
      .getState()
      .expandAllNeighbourhoods(neighbourhoodIds);
  };

  const useNestedLots = (): NestedLotsWithIndicatorsInterface => {
    const nestedLots = React.useMemo<NestedLotsWithIndicatorsInterface>(() => {
      return useLotService.computeNestedLots(
        workgroupId,
        lots,
        neighbourhoodsWithZones,
        selectedLots,
        expandedZones,
        expandedNeighbourhoods,
      );
    }, [
      workgroupId,
      lots,
      neighbourhoodsWithZones,
      selectedLots,
      expandedZones,
      expandedNeighbourhoods,
    ]);
    return nestedLots;
  };

  const assignZoneToUser = (zoneId: string, userId: string) => {
    const zones = neighbourhoodsWithZones.neighbourhoods.flatMap(
      (n) => n.zones,
    );
    const updatedZones = useLotService.assignZoneToUser(zones, userId, zoneId);

    // Update store with the new zones data
    useLotStore.setState((state) => ({
      neighbourhoodZoneData: {
        ...state.neighbourhoodZoneData,
        neighbourhoods: state.neighbourhoodZoneData.neighbourhoods.map((n) => ({
          ...n,
          zones: n.zones.map(
            (zone) =>
              updatedZones.find((z) => z.zoneId === zone.zoneId) || zone,
          ),
        })),
      },
    }));
  };

  const unassignZoneFromUser = (zoneId: string, userId: string) => {
    const zones = neighbourhoodsWithZones.neighbourhoods.flatMap(
      (n) => n.zones,
    );
    const updatedZones = useLotService.unassignZoneFromUser(
      zones,
      userId,
      zoneId,
    );

    // Update store with the new zones data
    useLotStore.setState((state) => ({
      neighbourhoodZoneData: {
        ...state.neighbourhoodZoneData,
        neighbourhoods: state.neighbourhoodZoneData.neighbourhoods.map((n) => ({
          ...n,
          zones: n.zones.map(
            (zone) =>
              updatedZones.find((z) => z.zoneId === zone.zoneId) || zone,
          ),
        })),
      },
    }));
  };

  const updateZoneAssignmentsForMember = (
    userId: string,
    accessToAllLots: boolean,
  ) => {
    if (accessToAllLots) {
      useUserService.updateUserAccessToAllLots(
        userId,
        accessToAllLots,
        activeWorkgroupId,
      );
      useLotService.clearZoneAssignmentsForMemberInWorkgroup(
        userId,
        activeWorkgroupId,
      );
    } else {
      useLotService.updateZoneAssignmentsForMemberInWorkgroupUsingSelection(
        userId,
        workgroupId,
        neighbourhoodsWithZones,
        useNestedLots(),
      );
    }
    deselectAllLots();
  };

  const selectAssignedZonesForUser = (userId: string) => {
    const assignedLots = useLotService.getAssignedLotsForUser(
      userId,
      activeWorkgroupId,
    );
    const lotIds = assignedLots.map((lot) => lot.lotId);
    toggleSelectionForLotsArray(lotIds);
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

  const getTemporaryUserData = (): {
    temporaryUserData: TemporaryUserData | null;
    temporaryisNewUser: boolean;
  } => {
    return useUserService.getTemporaryUserData();
  };

  const setTemporaryUserData = (
    userData: TemporaryUserData | null,
    isNewUser: boolean,
  ) => {
    useUserService.setTemporaryUserData(userData, isNewUser);
  };

  const useUsersInActiveWorkgroupWithRoles =
    (): UserInActiveWorkgroupWithRole[] => {
      const activeWorkgroup = getActiveWorkgroup();
      const activeWorkgroupId = activeWorkgroup?.workgroupId;

      // Subscribe to users
      const allUsers = useUserService.useAllUsers();

      // Get assigned counts per user from useLotService
      const assignedZonesByUser =
        useLotService.useAssignedZonesCountPerUserInWorkgroup(
          activeWorkgroupId,
        );
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
      }, [
        activeWorkgroupId,
        allUsers,
        assignedZonesByUser,
        assignedLotsByUser,
      ]);
    };

  return {
    useNestedLots,
    toggleLotSelection: toggleSelectionForSingleLot,
    toggleZoneSelection,
    deselectAllLots,
    updateZoneAssignmentsForMember,
    selectAssignedZonesForUser,
    getUserInActiveWorkgroupWithRole,
    useUsersInActiveWorkgroupWithRoles,
    inviteUserToActiveWorkgroup,
    expandAllNeighbourhoods,

    // temporary user data for navigation purposes
    getTemporaryUserData,
    setTemporaryUserData,
  };
};

export default useTeamManagementController;
