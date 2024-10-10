import { makeAutoObservable, observable } from 'mobx';

import { LotClass } from './LotClass';
import { LotInterface } from '../types/types';

class LotStore {
  lots: LotInterface[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  initializeLots(lots: LotInterface[]) {
    this.setLots(lots);
  }

  setLots(lotsData: LotClass[]) {
    this.lots = lotsData.map((data) => new LotClass(data)); // Creates Lot instances for each item
  }

  toggleLotSelection(id: number) {
    const lot = this.lots.find((lot) => lot.id === id);
    if (lot) {
      lot.isSelected = !lot.isSelected;
    }
  }

  get selectedLots() {
    return this.lots.filter((lot) => lot.isSelected);
  }

  get allLotsSelectedByNeighbourhood() {
    return [];
  }

  get allLotsSelectedByZone() {
    return null;
  }
}

const lotStore = new LotStore();
export default lotStore;
