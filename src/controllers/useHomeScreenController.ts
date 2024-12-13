// useHomeScreenController.ts

import React, { useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid'; //ID Generator

import BackendService from '../backend/BackendService';
import useLotService from '../services/useLotService';
import useUserService from '../services/useUserService';
import useWorkgroupService from '../services/useWorkgroupService';
import useHomeScreenStore from '../stores/useHomeScreenStore';
import useLotStore from '../stores/useLotStore';
import useWorkgroupStore from '../stores/useWorkgroupStore';
import {
  LotComputedForDisplay,
  ZoneData,
  UserInterface,
  UserInActiveWorkgroupWithRole,
  TemporaryUserData,
  NestedLotsWithIndicatorsInterface,
  NeighbourhoodZoneData,
  NeighbourhoodData,
  LotInStore,
} from '../types/types';
import { userHasPermission } from '../utils/permissionUtils';
import { IHomeScreenController } from './../types/controllerTypes';

const useHomeScreenController = (): IHomeScreenController => {
  const workgroupId = useWorkgroupStore((state) => state.activeWorkgroupId);
  const lots: LotInStore[] = useLotStore((state) => state.lots);
  const neighbourhoodsWithZones: NeighbourhoodData[] = useLotStore(
    (state) => state.neighbourhoodZoneData.neighbourhoods,
  );
  const selectedLots: Set<string> = useHomeScreenStore(
    (state) => state.selectedLots,
  );
  const expandedZones: Set<string> = useHomeScreenStore(
    (state) => state.expandedZones,
  );
  const expandedNeighbourhoods: Set<string> = useHomeScreenStore(
    (state) => state.expandedNeighbourhoods,
  );

  const initializeServices = () => {
    // Initialize Lots, Zones and Neighbourhoods
    const lotsData = BackendService.getMyLots();
    console.log('lotsData:', lotsData);
    const neighbourhoodData = BackendService.getNeighbourhoodZoneData();
    console.log('neighbourhoodData:', neighbourhoodData);
    useLotStore.getState().initializeLots(lotsData);
    useLotStore.getState().initializeNeighbourhoodsAndZones(neighbourhoodData);

    // Initialize Users and Workgroups
    useUserService.initializeUsers();
    useWorkgroupService.initializeWorkgroups();
    setActiveWorkgroup('1');

    console.log('\n\nInitialized lots:', lots);
    console.log('\n\nInitialized lots:', lots);
  };

  const markLotCompletedForSpecificDate = (lotId: string, date?: Date) => {
    const updatedLots = useLotService.markLotCompletedForSpecificDate(
      lots,
      lotId,
      date,
    );
    updatedLots.forEach((updatedLot) => {
      if (updatedLot.lotId === lotId) {
        useLotStore
          .getState()
          .updateLotLastMowingDate(updatedLot.lotId, updatedLot.lastMowingDate);
        // updatedLot.lastMowingDate is never undefined because there is a default value inside markLotCompletedForSpecificDate
      }
    });
  };

  const markSelectedLotsCompletedForSpecificDate = (date?: Date) => {
    const updatedLots = useLotService.markSelectedLotsCompletedForSpecificDate(
      lots,
      selectedLots,
      date,
    );
    updatedLots.forEach((updatedLot) => {
      if (selectedLots.has(updatedLot.lotId)) {
        useLotStore
          .getState()
          .updateLotLastMowingDate(updatedLot.lotId, updatedLot.lastMowingDate);
        // updatedLot.lastMowingDate is never undefined because there is a default value inside markSelectedLotsCompletedForSpecificDate
      }
    });
    return true;
  };

  const createLot = (lot: Partial<LotInStore>): boolean => {
    try {
      const newLot = useLotService.createLot(lot, workgroupId);
      useLotStore.getState().addLot(newLot);
      return true; // Indicate success
    } catch (error) {
      console.error('Error creating lot:', error);
      return false; // Indicate failure
    }
  };

  const createZone = (neighbourhoodId: string, zoneLabel: string): ZoneData => {
    const zone = useLotService.addZoneToNeighbourhood(
      neighbourhoodId,
      zoneLabel,
    );

    useLotStore.getState().addZoneToNeighbourhood(neighbourhoodId, zone);

    return zone;
  };

  const createNeighbourhood = (
    neighbourhoodLabel: string,
  ): NeighbourhoodData => {
    const neighbourhood = useLotService.addNeighbourhood(
      workgroupId,
      neighbourhoodLabel,
    );

    useLotStore.getState().addNeighbourhood(neighbourhood);

    return neighbourhood;
  };

  const setActiveWorkgroup = (workgroupId: string) => {
    useWorkgroupService.setActiveWorkgroup(workgroupId);
  };

  const toggleLotSelection = (lotId: string, newState: boolean) => {
    useHomeScreenStore.getState().toggleSelectionSingleLot(lotId, newState);
  };

  // const toggleZoneSelection = (zoneId: string, newState: boolean) => {
  //   console.log(lots);

  //   const lotIdsForZone = lots
  //     .filter((lot) => lot.zoneId === zoneId)
  //     .map((lot) => lot.lotId);

  //   useHomeScreenStore
  //     .getState()
  //     .toggleSelectionLotsArray(lotIdsForZone, newState);
  // };

  const toggleZoneSelection = (zoneId: string, newState: boolean) => {
    const currentLots = useLotStore.getState().lots;
    console.log(currentLots);

    const lotIdsForZone = currentLots
      .filter((lot) => lot.zoneId === zoneId)
      .map((lot) => lot.lotId);

    useHomeScreenStore
      .getState()
      .toggleSelectionLotsArray(lotIdsForZone, newState);
  };

  // const toggleZoneSelection = useCallback(
  //   (zoneId: string, newState: boolean) => {
  //     const currentLots = useLotStore.getState().lots;
  //     console.log(currentLots);

  //     const lotIdsForZone = currentLots
  //       .filter((lot) => lot.zoneId === zoneId)
  //       .map((lot) => lot.lotId);

  //     useHomeScreenStore
  //       .getState()
  //       .toggleSelectionLotsArray(lotIdsForZone, newState);
  //   },
  //   [],
  // );

  const toggleNeighbourhoodSelection = (
    neighbourhoodId: string,
    newState: boolean,
  ) => {
    const lotIdsForNeighbourhood = lots
      .filter((lot) => lot.neighbourhoodId === neighbourhoodId)
      .map((lot) => lot.lotId);

    useHomeScreenStore
      .getState()
      .toggleSelectionLotsArray(lotIdsForNeighbourhood, newState);
  };

  const deselectAllLots = () => {
    useHomeScreenStore.getState().deselectAllLots();
  };

  const toggleZoneExpansion = (zoneId: string) => {
    useHomeScreenStore.getState().toggleZoneExpansion(zoneId);
  };

  const collapseAllZones = () => {
    useHomeScreenStore.getState().collapseAllZones();
  };

  const toggleNeighbourhoodExpansion = (neighbourhoodId: string) => {
    useHomeScreenStore.getState().toggleNeighbourhoodExpansion(neighbourhoodId);
  };

  const collapseAllNeighbourhoods = () => {
    useHomeScreenStore.getState().collapseAllNeighbourhoods();
  };

  const expandAllNeighbourhoods = (neighbourhoodIds: string[]) => {
    useHomeScreenStore.getState().expandAllNeighbourhoods(neighbourhoodIds);
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

  const useNeighbourhoodsWithZones = (): NeighbourhoodData[] => {
    return neighbourhoodsWithZones;
  };

  return {
    initializeServices,

    // Lots, zones, neighbourhoods
    useNestedLots,
    useNeighbourhoodsWithZones,
    createLot,
    createZone,
    createNeighbourhood,
    markLotCompletedForSpecificDate,
    markSelectedLotsCompletedForSpecificDate,

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
  };
};

export default useHomeScreenController;
