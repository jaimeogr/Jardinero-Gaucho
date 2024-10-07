// types.ts or interfaces.ts

export interface LotInterface {
  id: number; // Optional id for the lot
  number: string; // Lot number
  zone: string; // Area of the lot
  neighbourhood: string; // Neighbourhood of the lot
  lastMowingDate: Date;
  extraNotes?: string; // Optional extra notes about the lot
  assignedTo?: number[]; // Optional users assigned to the lot
  isSelected?: boolean; // Optional flag to indicate if the lot is selected
}

export interface GroupOfLotsInterface {
  lots: LotInterface[]; // lots is an array of LotInterface
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
