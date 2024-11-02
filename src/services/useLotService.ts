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
    zones: [],
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
  };
  return useLotStore.getState().addZoneToNeighbourhood(neighbourhoodId, zone);
};

const useNeighbourhoodsAndZones = (workgroupId: string) => {
  const neighbourhoodZoneData = useLotStore(
    (state) => state.neighbourhoodZoneData,
  );
  return React.useMemo(() => {
    const filteredNeighbourhoods = neighbourhoodZoneData.neighbourhoods.filter(
      (n) => n.workgroupId === workgroupId,
    );
    return { neighbourhoods: filteredNeighbourhoods };
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

// Function to reassign a lot (stub for further implementation)
// export const reassignLot = (lotId: string, newUserId: number) => {
//   const lot = useLotStore.getState().lots.find((lot) => lot.lotId === lotId);
//   if (!lot) {
//     throw new Error('Lot not found');
//   }

//   // Check if the user is allowed to reassign tasks
//   checkUserAuthentication(lot.workgroupId, 'Manager'); // Only Managers and Owners can reassign tasks

//   // Update the lot assignment in the store
//   useLotStore.getState().updateLot(lotId, { assignedTo: [newUserId] });

//   // Sync with the database (replace with actual API call)
//   syncLotWithDatabase(lotId, { assignedTo: [newUserId] });
// };

export const useNestedLots = (): NestedLotsWithIndicatorsInterface => {
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

const toggleZoneSelection = (zoneId: string, newState: boolean) => {
  useLotStore.getState().toggleZoneSelection(zoneId, newState);
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

const assignMemberToSelection = (userId: string) => {
  const { neighbourhoodZoneData } = useLotStore.getState();

  // Clone the neighbourhoodZoneData to avoid direct mutation
  const updatedNeighbourhoodZoneData = {
    ...neighbourhoodZoneData,
    neighbourhoods: neighbourhoodZoneData.neighbourhoods.map(
      (neighbourhood) => ({
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
              : // Remove userId if it exists in the array
                zone.assignedTo.filter((id) => id !== userId),
          };
        }),
      }),
    ),
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
  deselectAllLots,
  assignMemberToSelection,
  getNumberOfAssignedLotsForUserInSpecificWorkgroup,
};
