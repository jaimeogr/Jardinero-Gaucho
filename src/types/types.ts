// types.ts or interfaces.ts

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

export interface ZoneInterface {
  zoneId: string; // Ensure you have this data or adjust accordingly
  zoneLabel: string;
  needMowing: number;
  needMowingCritically: number;
  doesntNeedMowing: number;
  isSelected: boolean;
  lots: LotWithNeedMowingInterface[];
}

export interface NeighbourhoodInterface {
  neighbourhoodId: string; // Ensure you have this data or adjust accordingly
  neighbourhoodLabel: string;
  needMowing: number;
  needMowingCritically: number;
  doesntNeedMowing: number;
  isSelected: boolean;
  zones: ZoneInterface[];
}

export interface GroupOfUsersInterface {
  users: UserInterface[];
}

export type UserRole = 'PrimaryOwner' | 'Owner' | 'Manager' | 'Member';

export interface UserInterface {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  workgroupRoles: { [workgroupId: string]: UserRole };
}

export interface WorkgroupInterface {
  workgroupId: string;
  name: string;
  primaryOwnerId: string; // User ID of the primary owner
  ownerIds: string[]; // User IDs who are secondary owners
  managerIds: string[]; // User IDs who are managers
  memberIds: string[]; // User IDs who are members
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
