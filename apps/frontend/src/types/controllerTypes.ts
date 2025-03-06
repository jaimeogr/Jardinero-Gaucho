// controllerTypes.ts

import { NestedLotsWithIndicatorsInterface, NeighbourhoodData, ZoneData, LotInStore } from '@/types/types';

export interface IAccordionController {
  useNestedLots(): NestedLotsWithIndicatorsInterface;
  deselectAllLots(): void;
  toggleLotSelection(lotId: string, newState: boolean): void;
  toggleZoneSelection(zoneId: string, newState: boolean): void;
  toggleNeighbourhoodSelection(neighbourhoodId: string, newState: boolean): void;
  toggleNeighbourhoodExpansion(neighbourhoodId: string): void;
  toggleZoneExpansion(zoneId: string): void;
  collapseAllZones(): void;
  collapseAllNeighbourhoods(): void;
  expandAllNeighbourhoods(): void;
}

export interface IHomeScreenController extends IAccordionController {
  useNeighbourhoodsWithZones(): NeighbourhoodData[];
  initializeServices(): void;
  createLot(lot: Partial<LotInStore>): Promise<LotInStore>;
  createZone(neighbourhoodId: string, zoneLabel: string): Promise<ZoneData>;
  createNeighbourhood(neighbourhoodLabel: string): Promise<NeighbourhoodData>;
  markLotCompletedForSpecificDate(lotId: string, date?: Date): void;
  markSelectedLotsCompletedForSpecificDate(date?: Date): void;
}
