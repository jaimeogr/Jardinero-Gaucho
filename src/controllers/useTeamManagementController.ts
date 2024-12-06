// useTeamManagementController.ts
import React from 'react';

import useLotService from '../services/useLotService';
import useUserService from '../services/useUserService';
import useLotStore from '../stores/useLotStore';
import useWorkgroupStore from '../stores/useWorkgroupStore';
import useZoneAssignmentScreenStore from '../stores/useZoneAssignmentScreenStore';
import {
  LotComputedForDisplay,
  LotInStore,
  NeighbourhoodData,
  NestedLotsWithIndicatorsInterface,
  UserInActiveWorkgroupWithRole,
  TemporaryUserData,
  UserRole,
  UserInterface,
} from '../types/types';

const useTeamManagementController = () => {
  const {
    toggleLotSelection,
    selectLots,
    deselectLots,
    deselectAllLots,
    toggleZoneExpansion,
    collapseAllZones,
    toggleNeighbourhoodExpansion,
    expandAllNeighbourhoods,
  } = useZoneAssignmentScreenStore();

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

  const toggleZoneSelection = (zoneId: string, newState: boolean) => {
    const lotsInZone = lots.filter(
      (lot) => lot.zoneId === zoneId && lot.workgroupId === workgroupId,
    );
    const lotIds = lotsInZone.map((lot) => lot.lotId);

    if (newState) {
      selectLots(lotIds);
    } else {
      deselectLots(lotIds);
    }
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
    selectLots(lotIds);
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
    toggleLotSelection,
    toggleZoneSelection,
    deselectAllLots,
    updateZoneAssignmentsForMember,
    selectAssignedZonesForUser,
    getUserInActiveWorkgroupWithRole,
    useUsersInActiveWorkgroupWithRoles,
    inviteUserToActiveWorkgroup,
    expandAllNeighbourhoods:
      useZoneAssignmentScreenStore.getState().expandAllNeighbourhoods,

    // temporary user data for navigation purposes
    getTemporaryUserData,
    setTemporaryUserData,
  };
};

export default useTeamManagementController;
