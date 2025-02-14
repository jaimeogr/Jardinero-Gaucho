// types.ts or interfaces.ts

// 1. In the future i can have a  data type for my current user where it has an array of WorkgroupDataForUser,
// and in the other hand a single WorkgroupDataForUser for each team member.
// Since each workgroup would load the corresponding users,
// and even if users are repeated accross workgroups, it should be handled appropiately.
// In this way, data structures would be decoupled from one workgroup to another, minimizing errors.
//
//
// 2. In the future i can have different data types for neighbourhood/zones like LotInStore, LotComputedForDisplay
//
//
// 3. In the future i can remove NeighbourhoodZoneData for the sake of goodwill and use NeighbourhoodData instead :)
//
// 4. In the future i can combine LotWithNeedMowingInterface and LotComputedForDisplay.

// LOTS / ZONES / NEIGHBOURHOODS
export interface LotInStore {
  workgroupId: string;
  lotId: string; // Unique identifier for the lot, now as a UUID
  lotLabel: string; // Lot number or label
  zoneId: string; // ID of the zone the lot belongs to, as a UUID
  neighbourhoodId: string; // ID of the neighbourhood the lot belongs to, as a UUID
  lastMowingDate?: Date; // Last mowing date for the lot
  extraNotes?: string; // Optional extra notes about the lot
}

export interface LotComputedForDisplay extends LotInStore {
  zoneLabel: string; // Name of the zone
  neighbourhoodLabel: string; // Name of the neighbourhood
  lotIsSelected: boolean; // Selection state of the lot
}

export interface LotWithNeedMowingInterface extends LotComputedForDisplay {
  needMowing: number;
}

export interface ZoneWithIndicatorsInterface {
  zoneId: string; // Ensure you have this data or adjust accordingly
  zoneLabel: string;
  needMowing: number;
  needMowingCritically: number;
  doesntNeedMowing: number;
  isSelected: boolean;
  isExpanded: boolean;
  lots: LotWithNeedMowingInterface[];
}

export interface NeighbourhoodWithIndicatorsInterface {
  neighbourhoodId: string; // Ensure you have this data or adjust accordingly
  neighbourhoodLabel: string;
  needMowing: number;
  needMowingCritically: number;
  doesntNeedMowing: number;
  isSelected: boolean;
  isExpanded: boolean;
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
  isExpanded: boolean;
}

export interface NeighbourhoodData {
  workgroupId: string;
  neighbourhoodId: string;
  neighbourhoodLabel: string;
  zones: ZoneData[];
  isSelected: boolean;
  isExpanded: boolean;
}

export interface NeighbourhoodZoneData {
  neighbourhoods: NeighbourhoodData[];
}

// USERS / WORKGROUPS
export type UserRole = 'PrimaryOwner' | 'Owner' | 'Manager' | 'Member';

export interface WorkgroupDataForUser {
  // this is the workgroup data that corresponds to the user, but not data about the workgroup itself, so thats why the namee of the workgroup is not here.
  workgroupId: string;
  role: UserRole;
  hasAcceptedPresenceInWorkgroup: boolean;
  accessToAllLots: boolean;
  assignedNeighbourhoods: string[];
  assignedZones: string[];
}

export interface WorkgroupInterface {
  // data of the workgroup itself
  workgroupId: string;
  name: string;
}

export interface UserInterface {
  userId: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  workgroupAssignments?: WorkgroupDataForUser[];
}

export interface TemporaryUserData {
  email: string;
  role: UserRole;
  accessToAllLots: boolean;
}

export type UserInActiveWorkgroupWithRole = UserInterface &
  WorkgroupDataForUser & {
    // This is a combination of UserInterface and WorkgroupAssignment plus some assigned zones and lots
    // the reason why the WorkgroupDataForUser is combined in the root of the object is because in this way the data specific to the current workgroup is exposed in a more clear way.
    assignedZonesCount: number;
    assignedLotsCount: number;
  };

export interface TaskInterface {
  taskId: string;
  lotId: string;
  userId: string;
  taskType: 'mowing' | 'watering' | 'fertilizing' | string;
  date: Date;
  completed: boolean;
  workgroupId: string;
}
