// useUserService.ts
import BackendService from '../backend/BackendService';
import useUserStore from '../stores/useUserStore';
import {
  UserInterface,
  TemporaryUserData,
  LotInStore,
  NeighbourhoodData,
} from '../types/types';

const initializeUsers = () => {
  const currentUser = BackendService.getMyUser();

  const usersFromAllMyWorkgroups: UserInterface[] =
    BackendService.getUsersFromAllMyWorkgroups();

  useUserStore.getState().initializeUsers(usersFromAllMyWorkgroups);
  useUserStore.getState().setCurrentUser(currentUser);
};

const useGetCurrentUser = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  return currentUser;
};

const getUserById = (userId: string): UserInterface | undefined => {
  return useUserStore.getState().getUserById(userId);
};

// const useAllUsers = (): UserInterface[] => {
//   const allUsers = useUserStore((state) => state.users);
//   return allUsers;
// };

const addUser = (user: UserInterface) => {
  useUserStore.getState().addUser(user);
};

const updateUser = (userId: string, updatedInfo: Partial<UserInterface>) => {
  useUserStore.getState().updateUser(userId, updatedInfo);
};

const updateUserAccessToAllLots = (
  userId: string,
  accessToAllLots: boolean,
  activeWorkgroupId: string | null,
) => {
  if (!activeWorkgroupId) {
    console.log('No active workgroup selected');
    return;
  }

  const user = getUserById(userId);
  if (user) {
    const assignmentIndex = user.workgroupAssignments.findIndex(
      (wa) => wa.workgroupId === activeWorkgroupId,
    );
    if (assignmentIndex >= 0) {
      user.workgroupAssignments[assignmentIndex].accessToAllLots =
        accessToAllLots;
      updateUser(userId, user);
    }
  }
};

const getTemporaryUserData = (): {
  temporaryUserData: TemporaryUserData | null;
  temporaryisNewUser: boolean;
} => {
  const temporaryUserData = useUserStore.getState().TemporaryUserData;
  const temporaryisNewUser = useUserStore.getState().TemporaryisNewUser;
  return { temporaryUserData, temporaryisNewUser };
};

const setTemporaryUserData = (
  userData: TemporaryUserData | null,
  isNewUser: boolean,
) => {
  useUserStore.getState().setTemporaryUserData(userData);
  useUserStore.getState().setTemporaryIsNewUser(isNewUser);
};

function computeAssignedZonesCountPerUserInWorkgroup(
  workgroupId: string | null,
  users: UserInterface[],
  neighbourhoodsWithZones: NeighbourhoodData[],
): Record<string, number> {
  const assignedZonesByUser: Record<string, number> = {};

  if (!workgroupId) {
    return assignedZonesByUser;
  }

  // Collect all existing zoneIds for the given workgroup
  const existingZones = new Set<string>();
  const relevantNeighbourhoods = neighbourhoodsWithZones.filter(
    (n) => n.workgroupId === workgroupId,
  );

  for (const neighbourhood of relevantNeighbourhoods) {
    for (const zone of neighbourhood.zones) {
      existingZones.add(zone.zoneId);
    }
  }

  // Count only zones that still exist in the neighbourhoodZoneData structure
  // validZoneIds are the ones that exist and are assigned to the user
  // This helps avoid counting zones that have been deleted when userData is stale
  for (const user of users) {
    const assignment = user.workgroupAssignments.find(
      (wa) => wa.workgroupId === workgroupId,
    );
    if (assignment) {
      const validZoneIds = assignment.assignedZones.filter((zoneId) =>
        existingZones.has(zoneId),
      );
      assignedZonesByUser[user.userId] = validZoneIds.length;
    }
  }

  return assignedZonesByUser;
}

function computeAssignedLotsCountPerUserInWorkgroup(
  workgroupId: string | null,
  users: UserInterface[],
  lots: LotInStore[],
): Record<string, number> {
  const assignedLotsByUser: Record<string, number> = {};

  if (!workgroupId) {
    return assignedLotsByUser;
  }

  // Group lots by zoneId for quick lookup
  const lotsByZone: Record<string, LotInStore[]> = {};
  for (const lot of lots) {
    if (lot.workgroupId === workgroupId) {
      if (!lotsByZone[lot.zoneId]) {
        lotsByZone[lot.zoneId] = [];
      }
      lotsByZone[lot.zoneId].push(lot);
    }
  }

  // For each user, sum the lots in all assigned zones
  for (const user of users) {
    const assignment = user.workgroupAssignments.find(
      (wa) => wa.workgroupId === workgroupId,
    );
    if (assignment) {
      let totalLots = 0;
      for (const zoneId of assignment.assignedZones) {
        const zoneLots = lotsByZone[zoneId] || [];
        totalLots += zoneLots.length;
      }
      assignedLotsByUser[user.userId] = totalLots;
    }
  }

  return assignedLotsByUser;
}
export default {
  initializeUsers,
  useGetCurrentUser,
  getUserById,
  addUser,
  updateUser,
  updateUserAccessToAllLots,
  getTemporaryUserData,
  setTemporaryUserData,
  computeAssignedZonesCountPerUserInWorkgroup,
  computeAssignedLotsCountPerUserInWorkgroup,
};
