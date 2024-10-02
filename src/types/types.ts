// types.ts or interfaces.ts

export interface ScrollableItemProps {
  number: string; // Lot number
  zone: string; // Area of the lot
  neighbourhood: string; // Neighbourhood of the lot
  completed: boolean;
  extraNotes?: string; // Optional extra notes about the lot
}

// You can define additional interfaces for other data types in your app
export interface User {
  id: number;
  username: string;
  email: string;
}

// Extendability example
export interface ExtendedScrollableItemProps extends ScrollableItemProps {
  ownerName?: string; // Extra property for a specific type of lot item
}
