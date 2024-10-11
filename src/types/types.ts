// types.ts or interfaces.ts

export interface LotInterface {
  id: number; // Optional id for the lot
  number: string; // Lot number
  zone: string; // Area of the lot
  neighbourhood: string; // Neighbourhood of the lot
  lastMowingDate: Date;
  isSelected: boolean;
  extraNotes?: string; // Optional extra notes about the lot
  assignedTo?: number[]; // Optional users assigned to the lot
}

export interface GroupOfLotsInterface {
  lots: LotInterface[]; // lots is an array of LotInterface
}

export interface LotWithNeedMowingInterface extends LotInterface {
  needMowing: number;
}

export interface ZoneInterface {
  zone: string;
  zoneId: string; // Ensure you have this data or adjust accordingly
  needMowingCritically: number;
  needMowing: number;
  doesntNeedMowing: number;
  isSelected: boolean;
  lots: LotWithNeedMowingInterface[];
}

export interface NeighbourhoodInterface {
  neighbourhood: string;
  neighbourhoodId: string; // Ensure you have this data or adjust accordingly
  needMowingCritically: number;
  needMowing: number;
  doesntNeedMowing: number;
  isSelected: boolean;
  zones: ZoneInterface[];
}

// You can define additional interfaces for other data types in your app
export interface UserInterface {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface GroupOfUsersInterface {
  users: UserInterface[];
}
