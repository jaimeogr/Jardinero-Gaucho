// useLotService.ts

import { v4 as uuidv4 } from 'uuid'; //ID Generator

import { getNeighbourhoodZoneData, getLots, createNeighborhood, createZone, createLot } from '@/api/supabase/endpoints';
import {
  LotWithNeedMowingInterface,
  ZoneWithIndicatorsInterface,
  NeighbourhoodWithIndicatorsInterface,
  NestedLotsWithIndicatorsInterface,
  NeighbourhoodData,
  ZoneData,
  LotInStore,
  NeighbourhoodZoneData,
} from '@/types/types';
import { lotNeedsMowing } from '@/utils/DateAnalyser';

const initializeNeighbourhoodsAndZones = async (
  allTheUsersWorkgroupsIds: string[] | null,
): Promise<NeighbourhoodZoneData> => {
  if (!allTheUsersWorkgroupsIds || allTheUsersWorkgroupsIds.length === 0) {
    throw new Error('Missing or empty allTheUsersWorkgroupsIds in initializeNeighbourhoodsAndZones');
  }

  try {
    const neighbourhoodsAndZones = await getNeighbourhoodZoneData(allTheUsersWorkgroupsIds);
    return neighbourhoodsAndZones as NeighbourhoodZoneData;
  } catch (error) {
    console.log('Failed to initialize neighbourhoods and zones:', error.message);
    throw error;
  }
};

const initializeLots = async (allTheUsersWorkgroupsIds: string[] | null): Promise<LotInStore[]> => {
  if (!allTheUsersWorkgroupsIds) {
    throw new Error('Missing workgroupId in initializeLots');
  }

  try {
    const lots = await getLots(allTheUsersWorkgroupsIds);
    return lots as LotInStore[];
  } catch (error) {
    console.log('Failed to initialize lots:', error.message);
    throw error;
  }
};

const addLot = async (workgroupId: string | null, partialLot: Partial<LotInStore>): Promise<LotInStore> => {
  if (!workgroupId) {
    throw new Error('Missing workgroupId in createLot');
  }

  if (!partialLot.lotLabel || !partialLot.zoneId || !partialLot.neighbourhoodId) {
    throw new Error('Missing required fields in new lot');
  }

  try {
    const newLot = await createLot(
      workgroupId,
      partialLot.zoneId,
      partialLot.lotLabel,
      partialLot.lastMowingDate,
      partialLot.extraNotes,
    );
    // Return the new lot so the controller can handle updating the store
    return newLot as LotInStore;
  } catch (error) {
    console.log('Failed to create lot:', error.message);
    throw error;
  }
};

const addNeighborhood = async (workgroupId: string | null, neighbourhoodLabel: string): Promise<NeighbourhoodData> => {
  if (!workgroupId) {
    throw new Error('Missing workgroupId in addNeighbourhood');
  }

  try {
    let newNeighborhood: Partial<NeighbourhoodData> = await createNeighborhood(workgroupId, neighbourhoodLabel);
    newNeighborhood = { ...newNeighborhood, isSelected: false, isExpanded: false, zones: [] };
    return newNeighborhood as NeighbourhoodData;
  } catch (error) {
    console.log('Failed to create neighborhood:', error.message);
    throw error;
  }
};

const addZoneToNeighbourhood = async (
  workgroupId: string | null,
  neighbourhoodId: string,
  zoneLabel: string,
): Promise<ZoneData> => {
  if (!workgroupId) {
    throw new Error('Missing workgroupId in addZoneToNeighbourhood');
  }
  if (!neighbourhoodId) {
    throw new Error('Missing neighbourhoodId in addZoneToNeighbourhood');
  }

  try {
    let newZone: Partial<ZoneData> = await createZone(workgroupId, neighbourhoodId, zoneLabel);
    newZone = { ...newZone, isSelected: false, isExpanded: false };
    return newZone as ZoneData;
  } catch (error) {
    console.log('Failed to create zone:', error.message);
    throw error;
  }
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

export default {
  // Lots, zones, neighbourhoods
  initializeLots,
  initializeNeighbourhoodsAndZones,
  addLot,
  addNeighborhood,
  addZoneToNeighbourhood,
  computeNestedLots,
  markLotCompletedForSpecificDate,
  markSelectedLotsCompletedForSpecificDate,
};
