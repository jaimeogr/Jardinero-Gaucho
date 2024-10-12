import { create } from 'zustand';

import { LotInterface } from '../types/types';

interface LotStoreState {
  lots: LotInterface[];
  initializeLots: (lots: LotInterface[]) => void;
  toggleLotSelection: (lotId: string) => void;
  toggleZoneSelection: (zoneId: string) => void;
  toggleNeighbourhoodSelection: (neighbourhoodId: string) => void;
}

const useLotStore = create<LotStoreState>((set, get) => ({
  lots: [],

  initializeLots: (lots: LotInterface[]) => {
    set({ lots });
  },

  toggleLotSelection: (lotId: string) => {
    set((state) => ({
      lots: state.lots.map((lot) =>
        lot.lotId === lotId
          ? { ...lot, lotIsSelected: !lot.lotIsSelected }
          : lot,
      ),
    }));
  },

  toggleZoneSelection: (zoneId: string) => {
    set((state) => ({
      lots: state.lots.map((lot) =>
        lot.zoneId === zoneId
          ? { ...lot, lotIsSelected: !lot.lotIsSelected }
          : lot,
      ),
    }));
  },

  toggleNeighbourhoodSelection: (neighbourhoodId: string) => {
    set((state) => ({
      lots: state.lots.map((lot) =>
        lot.neighbourhoodId === neighbourhoodId
          ? { ...lot, lotIsSelected: !lot.lotIsSelected }
          : lot,
      ),
    }));
  },
}));

export default useLotStore;
