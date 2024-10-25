import { NeighbourhoodData } from './types';
// types.ts or interfaces.ts

// LOTS / ZONES / NEIGHBOURHOODS
export interface LotInterface {
  lotId: string; // Unique identifier for the lot, now as a UUID
  lotLabel: string; // Lot number or label
  zoneId: string; // ID of the zone the lot belongs to, as a UUID
  zoneLabel: string; // Name of the zone
  neighbourhoodId: string; // ID of the neighbourhood the lot belongs to, as a UUID
  neighbourhoodLabel: string; // Name of the neighbourhood
  lastMowingDate: Date; // Last mowing date for the lot
  lotIsSelected: boolean; // Selection state of the lot
  extraNotes?: string; // Optional extra notes about the lot
  assignedTo: string[]; // Users assigned to the lot, can still be numbers if these are internal references
  workgroupId: string;
}

export interface GroupOfLotsInterface {
  lots: LotInterface[]; // lots is an array of LotInterface
}

export interface LotWithNeedMowingInterface extends LotInterface {
  needMowing: number;
}

export interface ZoneWithIndicatorsInterface {
  zoneId: string; // Ensure you have this data or adjust accordingly
  zoneLabel: string;
  needMowing: number;
  needMowingCritically: number;
  doesntNeedMowing: number;
  isSelected: boolean;
  lots: LotWithNeedMowingInterface[];
}

export interface NeighbourhoodWithIndicatorsInterface {
  neighbourhoodId: string; // Ensure you have this data or adjust accordingly
  neighbourhoodLabel: string;
  needMowing: number;
  needMowingCritically: number;
  doesntNeedMowing: number;
  isSelected: boolean;
  zones: ZoneWithIndicatorsInterface[];
}

export interface NestedLotsWithIndicatorsInterface {
  nestedLots: NeighbourhoodWithIndicatorsInterface[];
  selectedLots: number;
}

// useful for selectors/pickers in LotCreationScreen and maybe useful for other places too
export interface ZoneData {
  zoneId: string;
  zoneLabel: string;
  isSelected: boolean;
}

export interface NeighbourhoodData {
  workgroupId: string;
  neighbourhoodId: string;
  neighbourhoodLabel: string;
  zones: ZoneData[];
  isSelected: boolean;
}

export interface NeighbourhoodZoneData {
  neighbourhoods: NeighbourhoodData[];
}

// export interface zoneIsSelectedInterface {
//   zoneId: string;
//   isSelected: boolean;
// }

// export interface neighbourhoodIsSelectedInterface {
//   NeighbourhoodId: string;
//   isSelected: boolean;
// }

// USERS / WORKGROUPS
export type UserRole = 'PrimaryOwner' | 'Owner' | 'Manager' | 'Member';

export interface GroupOfUsersInterface {
  users: UserInterface[];
}

export interface WorkgroupAssignment {
  workgroupId: string;
  role: UserRole;
  accessToAllLots: boolean;
  hasAcceptedPresenceInWorkgroup: boolean;
}

export interface UserInterface {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  workgroupAssignments: WorkgroupAssignment[];
}

export interface WorkgroupInterface {
  workgroupId: string;
  name: string;
}

export interface TaskInterface {
  taskId: string;
  lotId: string;
  userId: string;
  taskType: 'mowing' | 'watering' | 'fertilizing' | string;
  date: Date;
  completed: boolean;
  workgroupId: string;
}
