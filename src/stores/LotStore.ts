import { makeAutoObservable, observable } from 'mobx';

import { LotInterface } from '../types/types';

class LotStore {
  lots: LotInterface[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  initializeLots(lots: LotInterface[]) {
    this.setLots(lots);
  }

  setLots(lots: LotInterface[]) {
    this.lots = observable.array(lots.map((lot) => observable.object(lot)));
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
