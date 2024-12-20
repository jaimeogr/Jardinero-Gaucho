// controllerTypes.ts

import {
  NestedLotsWithIndicatorsInterface,
  NeighbourhoodData,
  ZoneData,
  LotInStore,
  UserInActiveWorkgroupWithRole,
  UserRole,
  UserInterface,
  TemporaryUserData,
} from './types';

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
  createLot(lot: Partial<LotInStore>): boolean;
  createZone(neighbourhoodId: string, zoneLabel: string): ZoneData;
  createNeighbourhood(neighbourhoodLabel: string): NeighbourhoodData;
  markLotCompletedForSpecificDate(lotId: string, date?: Date): void;
  markSelectedLotsCompletedForSpecificDate(date?: Date): void;
}

export interface ITeamManagementController extends IAccordionController {
  updateZoneAssignmentsAndRoleForUser(userId: string, accessToAllLots: boolean, role: UserRole): void;
  selectAssignedZonesForUser(userId: string): void;
  useUserInActiveWorkgroupWithRole(userId: string): UserInActiveWorkgroupWithRole | null;
  useUsersInActiveWorkgroupWithRoles(): UserInActiveWorkgroupWithRole[];
  inviteUserToActiveWorkgroup(email: string, role: UserRole, accessToAllLots: boolean): UserInterface | null;
  getTemporaryUserData(): {
    temporaryUserData: TemporaryUserData | null;
    temporaryisNewUser: boolean;
  };
  setTemporaryUserData(userData: TemporaryUserData | null, isNewUser: boolean): void;
}
