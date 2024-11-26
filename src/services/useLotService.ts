// useLotService.ts

import React from 'react';
import { v4 as uuidv4 } from 'uuid'; //ID Generator

import BackendService from '../backend/BackendService';
import useLotStore from '../stores/useLotStore';
import useUserStore from '../stores/useUserStore';
import useWorkgroupStore from '../stores/useWorkgroupStore';
import {
  LotInterface,
  LotWithNeedMowingInterface,
  ZoneWithIndicatorsInterface,
  NeighbourhoodWithIndicatorsInterface,
  NestedLotsWithIndicatorsInterface,
  NeighbourhoodData,
  ZoneData,
  WorkgroupAssignment,
  NeighbourhoodZoneData,
} from '../types/types';
import { lotNeedsMowing } from '../utils/DateAnalyser';
import { userHasPermission } from '../utils/permissionUtils';

const { getWorkgroupById } = useWorkgroupStore.getState();
const { updateLotLastMowingDate } = useLotStore.getState();

const { currentUser } = useUserStore.getState();

const initializeStore = () => {
  const lots = BackendService.getMyLots();
  const neighbourhoodsAndZones = BackendService.getNeighbourhoodZoneData();
  useLotStore.getState().initializeLots(lots);
  useLotStore
    .getState()
    .initializeNeighbourhoodsAndZones(neighbourhoodsAndZones);
};

const createLot = (workgroupId: string, newLot: Partial<LotInterface>) => {
  if (!newLot.lotLabel || !newLot.zoneId || !newLot.neighbourhoodId) {
    throw new Error('Missing required fields in new lot');
  }

  const lot: LotInterface = {
    ...newLot,
    lotId: uuidv4(),
    workgroupId: workgroupId,
  };

  useLotStore.getState().addLot(lot);
};

const getLotById = (lotId: string): LotInterface => {
  const lot = useLotStore.getState().lots.find((lot) => lot.lotId === lotId);
  if (!lot) {
    throw new Error('Lot not found');
  }
  return lot;
};

const addNeighbourhood = (
  workgroupId: string,
  neighbourhoodLabel: string,
): NeighbourhoodData => {
  const newNeighbourhood: NeighbourhoodData = {
    workgroupId: workgroupId,
    neighbourhoodId: uuidv4(),
    neighbourhoodLabel: neighbourhoodLabel,
    isSelected: false, // Initialize isSelected
    assignedTo: [], // Initialize assignedTo as an empty array
    zones: [], // Initialize zones as an empty array
  };
  return useLotStore.getState().addNeighbourhood(newNeighbourhood);
};

const addZoneToNeighbourhood = (
  neighbourhoodId: string,
  zoneLabel: string,
): ZoneData => {
  const zone: ZoneData = {
    zoneId: uuidv4(),
    zoneLabel: zoneLabel,
    isSelected: false, // Initialize isSelected
    assignedTo: [], // Initialize assignedTo as an empty array
  };
  return useLotStore.getState().addZoneToNeighbourhood(neighbourhoodId, zone);
};

const useNeighbourhoodsAndZones = (
  workgroupId: string,
): NeighbourhoodData[] => {
  const neighbourhoodZoneData = useLotStore(
    (state) => state.neighbourhoodZoneData,
  );
  return React.useMemo(() => {
    const filteredNeighbourhoods = neighbourhoodZoneData.neighbourhoods.filter(
      (n) => n.workgroupId === workgroupId,
    );
    return filteredNeighbourhoods;
  }, [neighbourhoodZoneData, workgroupId]);
};

const markLotCompletedForSpecificDate = (lotId: string, date?: Date) => {
  const { lots } = useLotStore.getState();
  const lot = lots.find((lot) => lot.lotId === lotId);
  if (!lot) {
    throw new Error('Lot not found');
  }
  if (!currentUser) {
    console.error('User not authenticated');
    return false;
  }
  const workgroup = getWorkgroupById(lot.workgroupId);
  if (!workgroup) {
    throw new Error('Workgroup not found');
  }
  // Check if the user has permission to complete the task
  const hasPermission = userHasPermission(
    workgroup,
    currentUser.userId,
    'Member',
  );
  if (!hasPermission) {
    console.error('User does not have permission to complete this task');
    return false;
  }
  // Complete the task and update the store
  updateLotLastMowingDate(lotId, date ? date : new Date());
  // Sync with the database (replace with actual API call)
  // syncLotWithDatabase(lotId, { lastMowingDate: new Date() });
  return true;
};

const markSelectedLotsCompletedForSpecificDate = (date?: Date) => {
  const { lots } = useLotStore.getState();
  // Filter out only the selected lots
  const selectedLots = lots.filter((lot) => lot.lotIsSelected);
  if (selectedLots.length === 0) {
    console.log('No lots selected');
    return false;
  }
  // Mark each selected lot as completed with the provided date or today's date
  selectedLots.forEach((lot) => {
    updateLotLastMowingDate(lot.lotId, date || new Date());
  });
  console.log(`${selectedLots.length} lots marked as completed`);
  return true;
};

export const useNestedLots = (): NestedLotsWithIndicatorsInterface => {
  // This function would change if i change the data structures into having lots as nested objects inside NeighbourhoodZoneData on the store.
  const lots = useLotStore((state) => state.lots);

  return React.useMemo<NestedLotsWithIndicatorsInterface>(() => {
    const result: NestedLotsWithIndicatorsInterface = {
      nestedLots: [],
      selectedLots: 0,
    };
    let selectedLotsCounter = 0;

    // Group lots by neighbourhood and zone
    const lotsByNeighbourhoodAndZone = lots.reduce(
      (acc, lot) => {
        const { neighbourhoodId, zoneId } = lot;

        if (!acc[neighbourhoodId]) {
          acc[neighbourhoodId] = {};
        }

        if (!acc[neighbourhoodId][zoneId]) {
          acc[neighbourhoodId][zoneId] = [];
        }

        acc[neighbourhoodId][zoneId].push(lot);
        return acc;
      },
      {} as Record<string, Record<string, LotInterface[]>>,
    );

    // Iterate over each neighbourhood
    for (const neighbourhood in lotsByNeighbourhoodAndZone) {
      let neighbourhoodNeedMowingCritically = 0;
      let neighbourhoodNeedMowing = 0;
      let neighbourhoodDoesntNeedMowing = 0;
      let neighbourhoodLabel = '';
      let neighbourhoodSelectedLotsCounter = 0;
      let neighbourhoodAllLotsCounter = 0;

      const zones: ZoneWithIndicatorsInterface[] = [];

      // Iterate over each zone within the neighbourhood
      for (const zone in lotsByNeighbourhoodAndZone[neighbourhood]) {
        const lotsInZone = lotsByNeighbourhoodAndZone[neighbourhood][zone];
        let zoneNeedMowingCritically = 0;
        let zoneNeedMowing = 0;
        let zoneDoesntNeedMowing = 0;
        let zoneLabel = '';
        let zoneSelectedLotsCounter = 0;

        // Iterate over each lot within the zone
        const lots: LotWithNeedMowingInterface[] = lotsInZone.map((lot) => {
          //the next two lines are for future use
          neighbourhoodLabel = lot.neighbourhoodLabel;
          zoneLabel = lot.zoneLabel;

          // logic for determining if the zone / neighbourhood is selected
          if (lot.lotIsSelected) {
            zoneSelectedLotsCounter++;
          }
          neighbourhoodAllLotsCounter++;

          // checking if the lot needs mowing
          const needsMowing = lotNeedsMowing(lot.lastMowingDate);
          if (needsMowing === 2) {
            zoneNeedMowingCritically++;
          } else if (needsMowing === 1) {
            zoneNeedMowing++;
          } else {
            zoneDoesntNeedMowing++;
          }

          return {
            ...lot,
            needMowing: needsMowing,
          };
        });

        // Update neighbourhood counters for mowing requirements
        neighbourhoodNeedMowingCritically += zoneNeedMowingCritically;
        neighbourhoodNeedMowing += zoneNeedMowing;
        neighbourhoodDoesntNeedMowing += zoneDoesntNeedMowing;
        // Update neighbourhood counters for selected lots
        neighbourhoodSelectedLotsCounter += zoneSelectedLotsCounter;

        const zoneOption: ZoneWithIndicatorsInterface = {
          zoneId: zone,
          zoneLabel: zoneLabel,
          needMowing: zoneNeedMowing,
          needMowingCritically: zoneNeedMowingCritically,
          doesntNeedMowing: zoneDoesntNeedMowing,
          isSelected: zoneSelectedLotsCounter == lotsInZone.length, // If all lots for the zone are selected, the zone is selected
          lots,
        };

        zones.push(zoneOption);
      }

      const neighbourhoodOption: NeighbourhoodWithIndicatorsInterface = {
        neighbourhoodId: neighbourhood,
        neighbourhoodLabel: neighbourhoodLabel,
        needMowing: neighbourhoodNeedMowing,
        needMowingCritically: neighbourhoodNeedMowingCritically,
        doesntNeedMowing: neighbourhoodDoesntNeedMowing,
        isSelected:
          neighbourhoodSelectedLotsCounter == neighbourhoodAllLotsCounter, // if all lots in a neighbourhood are selected, then the neighbourhood is selected
        zones,
      };

      selectedLotsCounter += neighbourhoodSelectedLotsCounter;

      result.nestedLots.push(neighbourhoodOption);
    }
    result.selectedLots = selectedLotsCounter;
    return result;
  }, [lots]);
};

const toggleLotSelection = (lotId: string, newState: boolean) => {
  useLotStore.getState().toggleLotSelection(lotId, newState);
};

const getZonesAssignedToUserInWorkgroup = (
  userId: string,
  workgroupId: string,
): string[] => {
  // Implement logic to return an array of zone IDs assigned to the user
  // For example:
  const assignedZones: string[] = [];
  useLotStore
    .getState()
    .neighbourhoodZoneData.neighbourhoods.filter(
      (n) => n.workgroupId === workgroupId,
    ) // Filter neighbourhoods by workgroup, this could be not necessary depending on which neighbourhoods are on the store.
    .forEach((n) =>
      n.zones
        .filter((zone) => zone.assignedTo.includes(userId))
        .forEach((zone) => assignedZones.push(zone.zoneId)),
    );
  return assignedZones;
};

const toggleZoneSelection = (zoneId: string, newState: boolean) => {
  useLotStore.getState().toggleZoneSelection(zoneId, newState);
};

const preselectAssignedZonesInWorkgroupForUser = (
  userId: string,
  workgroupId: string,
) => {
  deselectAllLots();
  const assignedZones = getZonesAssignedToUserInWorkgroup(userId, workgroupId);
  assignedZones.forEach((zoneId) => {
    toggleZoneSelection(zoneId, true);
  });
};

const toggleNeighbourhoodSelection = (
  neighbourhoodId: string,
  newState: boolean,
) => {
  useLotStore
    .getState()
    .toggleNeighbourhoodSelection(neighbourhoodId, newState);
};

const deselectAllLots = () => {
  useLotStore.getState().deselectAllLots();
};

const selectAllZones = (activeWorkgroupId: string) => {
  const { neighbourhoodZoneData } = useLotStore.getState();
  const neighbourhoods = neighbourhoodZoneData.neighbourhoods.filter(
    (n) => n.workgroupId === activeWorkgroupId,
  );
  neighbourhoods.forEach((neighbourhood) => {
    neighbourhood.zones.forEach((zone) => {
      toggleZoneSelection(zone.zoneId, true);
    });
  });
  return true;
};

const clearZoneAssignmentsForMemberInWorkgroup = (
  userId: string,
  activeWorkgroupId: string,
) => {
  const { neighbourhoodZoneData } = useLotStore.getState();

  // Clone the neighbourhoodZoneData to avoid direct mutation
  const updatedNeighbourhoodZoneData = {
    ...neighbourhoodZoneData,
    neighbourhoods: neighbourhoodZoneData.neighbourhoods
      .filter((n) => n.workgroupId === activeWorkgroupId)
      .map((neighbourhood) => ({
        ...neighbourhood,
        zones: neighbourhood.zones.map((zone) => {
          return {
            ...zone,
            assignedTo: zone.assignedTo.filter((id) => id !== userId),
          };
        }),
      })),
  };

  // Update the store with the modified neighbourhoodZoneData
  useLotStore.setState({ neighbourhoodZoneData: updatedNeighbourhoodZoneData });
};

const updateZoneAssignmentsForMemberInWorkgroupUsingSelection = (
  userId: string,
  activeWorkgroupId: string,
) => {
  const { neighbourhoodZoneData } = useLotStore.getState();

  // Clone the neighbourhoodZoneData to avoid direct mutation
  const updatedNeighbourhoodZoneData = {
    ...neighbourhoodZoneData,
    neighbourhoods: neighbourhoodZoneData.neighbourhoods
      .filter((n) => n.workgroupId === activeWorkgroupId)
      .map((neighbourhood) => ({
        ...neighbourhood,
        zones: neighbourhood.zones.map((zone) => {
          const isZoneSelected = zone.isSelected;

          return {
            ...zone,
            assignedTo: isZoneSelected
              ? // Add userId if it's not already in the assignedTo array
                zone.assignedTo.includes(userId)
                ? zone.assignedTo
                : [...zone.assignedTo, userId]
              : // Remove userId if it exists in the array because the zone is not selected for the userId
                zone.assignedTo.filter((id) => id !== userId),
          };
        }),
      })),
  };

  // Update the store with the modified neighbourhoodZoneData
  useLotStore.setState({ neighbourhoodZoneData: updatedNeighbourhoodZoneData });
};

const getNumberOfAssignedLotsForUserInSpecificWorkgroup = (
  WorkgroupId: string,
  userId: string,
): number => {
  const { lots } = useLotStore.getState();
  const assignedLots = lots.filter(
    (lot) => lot.workgroupId === WorkgroupId && lot.assignedTo.includes(userId),
  );
  return assignedLots.length;
};

const useAssignedZonesCountPerUserInWorkgroup = (
  workgroupId: string | undefined,
) => {
  const neighbourhoodZoneData = useLotStore(
    (state) => state.neighbourhoodZoneData,
  );

  return React.useMemo(() => {
    const assignedZonesByUser: Record<string, number> = {};

    if (!workgroupId) {
      // Return an empty object if workgroupId is undefined
      return assignedZonesByUser;
    }

    // Filter neighbourhoods by workgroupId
    const neighbourhoods = neighbourhoodZoneData.neighbourhoods.filter(
      (n) => n.workgroupId === workgroupId,
    );

    neighbourhoods.forEach((neighbourhood) => {
      neighbourhood.zones.forEach((zone) => {
        zone.assignedTo.forEach((userId) => {
          if (!assignedZonesByUser[userId]) {
            assignedZonesByUser[userId] = 0;
          }
          assignedZonesByUser[userId] += 1;
        });
      });
    });

    return assignedZonesByUser;
  }, [neighbourhoodZoneData, workgroupId]);
};

const useAssignedLotsCountPerUserInWorkgroup = (
  workgroupId: string | undefined,
) => {
  // This function would change if i change the data structures into having lots as nested objects inside NeighbourhoodZoneData on the store.
  // Subscribe to the necessary data from the store
  const neighbourhoodZoneData = useLotStore(
    (state) => state.neighbourhoodZoneData,
  );
  const lots = useLotStore((state) => state.lots);

  return React.useMemo(() => {
    // Initialize an object to store the lots count per user
    const assignedLotsByUser: Record<string, number> = {};

    if (!workgroupId) {
      return assignedLotsByUser;
    }

    // Filter neighbourhoods that belong to the specified workgroup
    const neighbourhoodsInWorkgroup =
      neighbourhoodZoneData.neighbourhoods.filter(
        (neighbourhood) => neighbourhood.workgroupId === workgroupId,
      );

    // Build a map of zone assignments (zoneId to array of userIds)
    const zoneAssignments: Record<string, string[]> = {};

    neighbourhoodsInWorkgroup.forEach((neighbourhood) => {
      neighbourhood.zones.forEach((zone) => {
        zoneAssignments[zone.zoneId] = zone.assignedTo;
      });
    });

    // Build a map of lots grouped by their zoneId
    const lotsGroupedByZone: Record<string, LotInterface[]> = {};

    lots.forEach((lot) => {
      if (lot.workgroupId === workgroupId) {
        if (!lotsGroupedByZone[lot.zoneId]) {
          lotsGroupedByZone[lot.zoneId] = [];
        }
        lotsGroupedByZone[lot.zoneId].push(lot);
      }
    });

    // Calculate the lots assigned to each user
    for (const zoneId in zoneAssignments) {
      const userIds = zoneAssignments[zoneId];
      const lotsInZone = lotsGroupedByZone[zoneId] || [];

      userIds.forEach((userId) => {
        if (!assignedLotsByUser[userId]) {
          assignedLotsByUser[userId] = 0;
        }
        assignedLotsByUser[userId] += lotsInZone.length;
      });
    }

    return assignedLotsByUser;
  }, [neighbourhoodZoneData, lots, workgroupId]);
};

const getNumberOfAssignedZonesForUserInSpecificWorkgroup = (
  WorkgroupId: string,
  userId: string,
): number => {
  const { neighbourhoodZoneData } = useLotStore.getState();
  const neighbourhoods = neighbourhoodZoneData.neighbourhoods.filter(
    (n) => n.workgroupId === WorkgroupId,
  );
  let assignedZones = 0;
  if (!neighbourhoods) {
    // if there are no neighbourhoods found
    return 0;
  }
  neighbourhoods.forEach((neighbourhood) => {
    neighbourhood.zones.forEach((zone) => {
      if (Array.isArray(zone.assignedTo) && zone.assignedTo.includes(userId)) {
        // this type check helps prevent crashes
        assignedZones++;
      }
    });
  });
  return assignedZones;
};

export default {
  initializeStore,
  getLotById,
  createLot,
  markLotCompletedForSpecificDate,
  markSelectedLotsCompletedForSpecificDate,
  useNestedLots,
  useNeighbourhoodsAndZones,
  addZoneToNeighbourhood,
  addNeighbourhood,
  toggleLotSelection,
  toggleZoneSelection,
  toggleNeighbourhoodSelection,
  preselectAssignedZonesInWorkgroupForUser,
  deselectAllLots,
  selectAllZones,
  clearZoneAssignmentsForMemberInWorkgroup,
  updateZoneAssignmentsForMemberInWorkgroupUsingSelection,
  getNumberOfAssignedLotsForUserInSpecificWorkgroup,
  getNumberOfAssignedZonesForUserInSpecificWorkgroup,
  useAssignedZonesCountPerUserInWorkgroup,
  useAssignedLotsCountPerUserInWorkgroup,
};
