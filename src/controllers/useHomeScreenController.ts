// useHomeScreenController.ts

import React from 'react';
import { v4 as uuidv4 } from 'uuid'; //ID Generator

import BackendService from '../backend/BackendService';
import useLotService from '../services/useLotService';
import useUserService from '../services/useUserService';
import useWorkgroupService from '../services/useWorkgroupService';
import useHomeScreenStore from '../stores/useHomeScreenStore';
import useLotStore from '../stores/useLotStore';
import useWorkgroupStore from '../stores/useWorkgroupStore';
import {
  UserRole,
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

const useHomeScreenController = () => {
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
    useLotService.initializeStore();
    useUserService.initializeUsers();
    useWorkgroupService.initializeWorkgroups();
    setActiveWorkgroup('1');
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

  const createLot = (lot: Partial<LotInStore>) => {
    const newLot = useLotService.createLot(lot, workgroupId);
    useLotStore.getState().addLot(newLot);
    return true;
  };

  const createZone = (neighbourhoodId: string, zoneLabel: string): ZoneData => {
    return useLotService.addZoneToNeighbourhood(neighbourhoodId, zoneLabel);
  };

  const createNeighbourhood = (
    neighbourhoodLabel: string,
  ): NeighbourhoodData => {
    const activeWorkgroup = getActiveWorkgroup()?.workgroupId;
    return useLotService.addNeighbourhood(activeWorkgroup, neighbourhoodLabel);
  };

  const setActiveWorkgroup = (workgroupId: string) => {
    useWorkgroupService.setActiveWorkgroup(workgroupId);
  };

  const getActiveWorkgroup = () => {
    const activeWorkgroup = useWorkgroupService.getActiveWorkgroup();
    console.log('Active Workgroup:', activeWorkgroup);
    return activeWorkgroup;
  };

  const useCheckUserHasPermission = (requiredRole: UserRole) => {
    const currentUserId = useUserService.useGetCurrentUser()?.userId;
    if (!currentUserId) {
      console.error('Current user not found.');
      return false;
    }
    const workgroup = useWorkgroupService.useGetWorkgroupById(currentUserId);
    if (!workgroup) {
      console.error('Workgroup not found for the current user.');
      return false;
    }
    return userHasPermission(workgroup, currentUserId, requiredRole);
  };

  const toggleLotSelection = (lotId: string, newState: boolean) => {
    useHomeScreenStore.getState().toggleSelectionSingleLot(lotId, newState);
  };

  const toggleZoneSelection = (zoneId: string, newState: boolean) => {
    const lotIdsForZone = lots
      .filter((lot) => lot.zoneId === zoneId)
      .map((lot) => lot.lotId);

    useHomeScreenStore
      .getState()
      .toggleSelectionLotsArray(lotIdsForZone, newState);
  };

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

  return {
    initializeServices,

    // Lots, zones, neighbourhoods
    useNestedLots,
    createLot,
    markLotCompletedForSpecificDate,
    markSelectedLotsCompletedForSpecificDate,
    useCheckUserHasPermission,
    addZoneToNeighbourhood: createZone,
    addNeighbourhood: createNeighbourhood,

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
