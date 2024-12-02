// useTeamManagementController.ts
import useLotService from '../services/useLotService';
import useUserService from '../services/useUserService';
import useLotStore from '../stores/useLotStore';
import useWorkgroupStore from '../stores/useWorkgroupStore';
import useZoneAssignmentScreenStore from '../stores/useZoneAssignmentScreenStore';

const useTeamManagementController = () => {
  const {
    selectedLots,
    expandedZones,
    expandedNeighbourhoods,
    toggleLotSelection,
    selectLots,
    deselectLots,
    deselectAllLots,
    toggleZoneExpansion,
    collapseAllZones,
    toggleNeighbourhoodExpansion,
    expandAllNeighbourhoods,
  } = useZoneAssignmentScreenStore();

  const activeWorkgroupId = useWorkgroupStore(
    (state) => state.activeWorkgroupId,
  );

  const useNestedLots = () => {
    const nestedLots = useLotService.useNestedLots(
      selectedLots,
      expandedZones,
      expandedNeighbourhoods,
      activeWorkgroupId,
    );
    return nestedLots;
  };

  const toggleZoneSelection = (zoneId: string, newState: boolean) => {
    const lots = useLotStore
      .getState()
      .lots.filter(
        (lot) => lot.zoneId === zoneId && lot.workgroupId === activeWorkgroupId,
      );
    const lotIds = lots.map((lot) => lot.lotId);
    if (newState) {
      selectLots(lotIds);
    } else {
      deselectLots(lotIds);
    }
  };

  const toggleNeighbourhoodSelection = (
    neighbourhoodId: string,
    newState: boolean,
  ) => {
    const lots = useLotStore
      .getState()
      .lots.filter(
        (lot) =>
          lot.neighbourhoodId === neighbourhoodId &&
          lot.workgroupId === activeWorkgroupId,
      );
    const lotIds = lots.map((lot) => lot.lotId);
    if (newState) {
      selectLots(lotIds);
    } else {
      deselectLots(lotIds);
    }
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
      useLotService.clearZoneAssignmentsForMember(userId, activeWorkgroupId);
    } else {
      useLotService.updateZoneAssignmentsForMemberUsingSelection(
        userId,
        selectedLots,
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

  return {
    useNestedLots,
    toggleLotSelection,
    toggleZoneSelection,
    toggleNeighbourhoodSelection,
    deselectAllLots,
    updateZoneAssignmentsForMember,
    selectAssignedZonesForUser,
    getUserInActiveWorkgroupWithRole,
    inviteUserToActiveWorkgroup,
    expandAllNeighbourhoods:
      useZoneAssignmentScreenStore.getState().expandAllNeighbourhoods,

    // temporary user data for navigation purposes
    getTemporaryUserData,
    setTemporaryUserData,
  };
};

export default useTeamManagementController;
