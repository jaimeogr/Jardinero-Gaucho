import { makeAutoObservable } from 'mobx';

import { LotInterface } from '../types/types';

export class LotClass implements LotInterface {
  id: number;
  number: string;
  zone: string;
  neighbourhood: string;
  lastMowingDate: Date;
  isSelected: boolean;
  extraNotes?: string;
  assignedTo?: number[];

  constructor(data: LotInterface) {
    // Assign default values to ensure properties always have consistent types
    this.id = data.id;
    this.number = data.number;
    this.zone = data.zone;
    this.neighbourhood = data.neighbourhood;
    this.lastMowingDate = data.lastMowingDate;
    this.isSelected = data.isSelected; // Default to false if not provided
    this.assignedTo = data.assignedTo ?? [];
    this.extraNotes = data.extraNotes ?? '';

    makeAutoObservable(this); // Automatically make all properties reactive
  }
}
