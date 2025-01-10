// useUserService.ts

import BackendService from '../backend/BackendService';
import useUserStore from '../stores/useUserStore';
import {
  UserInterface,
  TemporaryUserData,
  LotInStore,
  NeighbourhoodData,
  NeighbourhoodWithIndicatorsInterface,
  WorkgroupDataForUser,
  UserRole,
} from '../types/types';

const initializeUsers = () => {
  const currentUser = BackendService.getMyUser();

  const usersFromAllMyWorkgroups: UserInterface[] = BackendService.getUsersFromAllMyWorkgroups();

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

const getTemporaryUserData = (): {
  temporaryUserData: TemporaryUserData | null;
  temporaryisNewUser: boolean;
} => {
  const temporaryUserData = useUserStore.getState().TemporaryUserData;
  const temporaryisNewUser = useUserStore.getState().TemporaryisNewUser;
  return { temporaryUserData, temporaryisNewUser };
};

const setTemporaryUserData = (userData: TemporaryUserData | null, isNewUser: boolean) => {
  useUserStore.getState().setTemporaryUserData(userData);
  useUserStore.getState().setTemporaryIsNewUser(isNewUser);
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

function updateUserAccessAndRole(
  user: UserInterface,
  accessToAllLots: boolean,
  role: UserRole,
  activeWorkgroupId: string | null,
  nestedLots: NeighbourhoodWithIndicatorsInterface[],
): WorkgroupDataForUser[] | undefined {
  if (!activeWorkgroupId) {
    console.warn('No active workgroup selected.');
    return;
  }

  if (!user) {
    console.warn('No user provided.');
    return;
  }

  // Map over the user's workgroup assignments to find and update the one for the active workgroup
  const updatedAssignments = user.workgroupAssignments.map((assignment) => {
    if (assignment.workgroupId !== activeWorkgroupId) {
      return assignment;
    }

    // If the user now has access to all lots, clear assigned zones/neighbourhoods
    if (accessToAllLots) {
      return {
        ...assignment,
        role,
        accessToAllLots: true,
        assignedNeighbourhoods: [],
        assignedZones: [],
      } as WorkgroupDataForUser;
    }

    // Otherwise, determine assigned neighbourhoods and zones from the nestedLots structure
    const assignedNeighbourhoods: string[] = [];
    const assignedZones: string[] = [];

    nestedLots.forEach((neighbourhood) => {
      if (neighbourhood.isSelected) {
        assignedNeighbourhoods.push(neighbourhood.neighbourhoodId);
      }

      neighbourhood.zones.forEach((zone) => {
        if (zone.isSelected) {
          assignedZones.push(zone.zoneId);
        }
      });
    });

    return {
      ...assignment,
      role,
      accessToAllLots: false,
      assignedNeighbourhoods,
      assignedZones,
    } as WorkgroupDataForUser;
  });

  return updatedAssignments;
}

function computeAssignedZonesCountPerUserInWorkgroup(
  workgroupId: string | null,
  users: UserInterface[],
  neighbourhoodsWithZones: NeighbourhoodData[],
): Record<string, number> {
  const assignedZonesByUser: Record<string, number> = {};

  if (!workgroupId) {
    return assignedZonesByUser;
  }

  for (const user of users) {
    const assignment = user.workgroupAssignments.find((wa) => wa.workgroupId === workgroupId);

    if (assignment) {
      // Initialize a set to collect unique assigned zone IDs
      const assignedZoneIds = new Set<string>(assignment.assignedZones);

      // Iterate through all neighborhoods and their zones
      neighbourhoodsWithZones.forEach((neighbourhood) => {
        neighbourhood.zones.forEach((zone) => {
          // Include zones if the parent neighborhood is assigned
          if (assignment.assignedNeighbourhoods.includes(neighbourhood.neighbourhoodId)) {
            assignedZoneIds.add(zone.zoneId);
          }

          // Include zones that are assigned directly
          if (assignment.assignedZones.includes(zone.zoneId)) {
            assignedZoneIds.add(zone.zoneId);
          }
        });
      });

      // Store the total count of unique assigned zones for the user
      assignedZonesByUser[user.userId] = assignedZoneIds.size;
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
    const assignment = user.workgroupAssignments.find((wa) => wa.workgroupId === workgroupId);
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
  updateUserAccessAndRole,
  getTemporaryUserData,
  setTemporaryUserData,
  computeAssignedZonesCountPerUserInWorkgroup,
  computeAssignedLotsCountPerUserInWorkgroup,
};
