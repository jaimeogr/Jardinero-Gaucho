// types.ts or interfaces.ts

export interface LotInterface {
  number: string; // Lot number
  zone: string; // Area of the lot
  neighbourhood: string; // Neighbourhood of the lot
  completed: boolean;
  extraNotes?: string; // Optional extra notes about the lot
}

export interface GroupOfLotsInterface {
  lots: LotInterface[]; // lots is an array of LotInterface
}

// You can define additional interfaces for other data types in your app
export interface UserInterface {
  id: number;
  username: string;
  email: string;
}
