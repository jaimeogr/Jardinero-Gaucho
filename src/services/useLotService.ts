// useLotService.ts

import { v4 as uuidv4 } from 'uuid'; //ID Generator

import {
  LotWithNeedMowingInterface,
  ZoneWithIndicatorsInterface,
  NeighbourhoodWithIndicatorsInterface,
  NestedLotsWithIndicatorsInterface,
  NeighbourhoodData,
  ZoneData,
  LotInStore,
} from '../types/types';
import { lotNeedsMowing } from '../utils/DateAnalyser';

const createLot = (workgroupId: string | null, newLot: Partial<LotInStore>): LotInStore => {
  if (!workgroupId) {
    throw new Error('Missing workgroupId in createLot');
  }

  if (!newLot.lotLabel || !newLot.zoneId || !newLot.neighbourhoodId) {
    throw new Error('Missing required fields in new lot');
  }

  const lot: LotInStore = {
    ...newLot,
    lotId: uuidv4(),
    workgroupId,
    lotLabel: newLot.lotLabel || '', // provide defaults if necessary
    lastMowingDate: newLot.lastMowingDate || new Date(),
  };

  // Return the new lot so the controller can handle updating the store
  return lot;
};

const markLotCompletedForSpecificDate = (allLots: LotInStore[], lotId: string, date?: Date): LotInStore[] => {
  // In a real scenario, you'd verify permissions here before updating.
  // Assuming permission is handled at a higher level.

  const updatedLots = allLots.map((lot) =>
    lot.lotId === lotId ? { ...lot, lastMowingDate: date || new Date() } : lot,
  );

  return updatedLots;
};

const markSelectedLotsCompletedForSpecificDate = (
  allLots: LotInStore[],
  selectedLots: Set<string>,
  date?: Date,
): LotInStore[] => {
  const updatedLots = allLots.map((lot) =>
    selectedLots.has(lot.lotId) ? { ...lot, lastMowingDate: date || new Date() } : lot,
  );

  console.log(`${selectedLots.size} lots marked as completed`);
  return updatedLots;
};

const computeNestedLots = (
  workgroupId: string | null,
  lots: LotInStore[],
  allNeighbourhoods: NeighbourhoodData[],
  selectedLots: Set<string>,
  expandedZones: Set<string>,
  expandedNeighbourhoods: Set<string>,
): NestedLotsWithIndicatorsInterface => {
  const result: NestedLotsWithIndicatorsInterface = {
    nestedLots: [],
    selectedLots: 0,
  };

  if (!workgroupId) {
    return result;
  }

  let workgroupSelectedLotsCounter = 0;

  // Filter lots by workgroup and Group lots by neighbourhood and zone
  const lotsByNeighbourhoodAndZone = lots
    .filter((lot) => lot.workgroupId === workgroupId)
    .reduce(
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
      {} as Record<string, Record<string, LotInStore[]>>,
    );

  // Iterate over each neighbourhood
  for (const neighbourhoodId in lotsByNeighbourhoodAndZone) {
    // Initialize counters
    let neighbourhoodNeedMowingCritically = 0;
    let neighbourhoodNeedMowing = 0;
    let neighbourhoodDoesntNeedMowing = 0;
    let neighbourhoodSelectedLotsCounter = 0;
    let neighbourhoodAllLotsCounter = 0;

    // Get neighbourhoodData from neighbourhoodZoneData to get this variables: isNeighbouhoodExpanded, isZoneExpanded, zoneData
    const neighbourhoodData = allNeighbourhoods
      .filter((neighbourhood) => neighbourhood.workgroupId === workgroupId)
      .find((n) => n.neighbourhoodId === neighbourhoodId);
    const neighbourhoodLabel = neighbourhoodData?.neighbourhoodLabel || '';
    const isNeighbourhoodExpanded = expandedNeighbourhoods.has(neighbourhoodId);

    const zones: ZoneWithIndicatorsInterface[] = [];

    // Iterate over each zone within the neighbourhood
    for (const zoneId in lotsByNeighbourhoodAndZone[neighbourhoodId]) {
      // Initialize counters
      let zoneNeedMowingCritically = 0;
      let zoneNeedMowing = 0;
      let zoneDoesntNeedMowing = 0;
      let zoneSelectedLotsCounter = 0;

      const lotsInZone = lotsByNeighbourhoodAndZone[neighbourhoodId][zoneId];

      // Get zone data from neighbourhoodData to check if the zone is expanded
      const zoneData = neighbourhoodData?.zones.find((z) => z.zoneId === zoneId);
      const zoneLabel = zoneData?.zoneLabel || '';
      const isZoneExpanded = expandedZones.has(zoneId);

      // Iterate over each lot within the zone
      const lots: LotWithNeedMowingInterface[] = lotsInZone.map((lot) => {
        const lotIsSelected = selectedLots.has(lot.lotId);
        if (lotIsSelected) {
          // counter for determining if the zone is selected
          zoneSelectedLotsCounter++;
        }
        // counter for determining if the neighbourhood is selected
        neighbourhoodAllLotsCounter++;

        // checking if the lot needs mowing
        const needMowing = lotNeedsMowing(lot.lastMowingDate);
        if (needMowing === 2) {
          zoneNeedMowingCritically++;
        } else if (needMowing === 1) {
          zoneNeedMowing++;
        } else {
          zoneDoesntNeedMowing++;
        }

        return {
          ...lot,
          lotIsSelected,
          needMowing,
          zoneLabel,
          neighbourhoodLabel,
        };
      });

      // Update neighbourhood counters
      neighbourhoodNeedMowingCritically += zoneNeedMowingCritically;
      neighbourhoodNeedMowing += zoneNeedMowing;
      neighbourhoodDoesntNeedMowing += zoneDoesntNeedMowing;
      neighbourhoodSelectedLotsCounter += zoneSelectedLotsCounter;

      // Check if all lots in the zone are selected
      const isZoneSelected = zoneSelectedLotsCounter === lotsInZone.length && lotsInZone.length > 0;

      const zoneOption: ZoneWithIndicatorsInterface = {
        zoneId: zoneId,
        zoneLabel: zoneLabel,
        needMowing: zoneNeedMowing,
        needMowingCritically: zoneNeedMowingCritically,
        doesntNeedMowing: zoneDoesntNeedMowing,
        isSelected: isZoneSelected, // If all lots for the zone are selected, the zone is selected
        isExpanded: isZoneExpanded,
        lots,
      };

      zones.push(zoneOption);
    }

    // Check if all lots in the neighbourhood are selected
    const isNeighbourhoodSelected =
      neighbourhoodSelectedLotsCounter === neighbourhoodAllLotsCounter && neighbourhoodAllLotsCounter > 0;

    const neighbourhoodOption: NeighbourhoodWithIndicatorsInterface = {
      neighbourhoodId: neighbourhoodId,
      neighbourhoodLabel: neighbourhoodLabel,
      needMowing: neighbourhoodNeedMowing,
      needMowingCritically: neighbourhoodNeedMowingCritically,
      doesntNeedMowing: neighbourhoodDoesntNeedMowing,
      isSelected: isNeighbourhoodSelected, // if all lots in a neighbourhood are selected, then the neighbourhood is selected
      isExpanded: isNeighbourhoodExpanded,
      zones,
    };

    workgroupSelectedLotsCounter += neighbourhoodSelectedLotsCounter;

    result.nestedLots.push(neighbourhoodOption);
  }
  result.selectedLots = workgroupSelectedLotsCounter;
  return result;
};

const addNeighbourhood = (workgroupId: string | null, neighbourhoodLabel: string): NeighbourhoodData => {
  if (!workgroupId) {
    throw new Error('Missing workgroupId in addNeighbourhood');
  }

  const newNeighbourhood: NeighbourhoodData = {
    workgroupId: workgroupId,
    neighbourhoodId: uuidv4(),
    neighbourhoodLabel: neighbourhoodLabel,
    isSelected: false, // Initialize isSelected
    isExpanded: false, // Initialize isExpanded
    zones: [], // Initialize zones as an empty array
  };
  return newNeighbourhood;
};

const addZoneToNeighbourhood = (neighbourhoodId: string, zoneLabel: string): ZoneData => {
  const zone: ZoneData = {
    zoneId: uuidv4(),
    zoneLabel: zoneLabel,
    isSelected: false, // Initialize isSelected
    isExpanded: false, // Initialize isExpanded
  };

  return zone;
};

export default {
  // Lots, zones, neighbourhoods
  createLot,
  computeNestedLots,
  markLotCompletedForSpecificDate,
  markSelectedLotsCompletedForSpecificDate,
  addZoneToNeighbourhood,
  addNeighbourhood,
};
