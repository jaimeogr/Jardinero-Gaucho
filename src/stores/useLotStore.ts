// LotStore.ts
import { create } from 'zustand';

import { LotInterface } from '../types/types';

interface LotStoreState {
  lots: LotInterface[];
  initializeLots: (lots: LotInterface[]) => void;
  setLots: (lotsData: LotInterface[]) => void;
  toggleLotSelection: (id: number) => void;
}

const useLotStore = create<LotStoreState>((set, get) => ({
  lots: [],

  initializeLots: (lots: LotInterface[]) => {
    set({ lots });
  },

  setLots: (lotsData: LotInterface[]) => {
    set({ lots: lotsData });
  },

  toggleLotSelection: (id: number) => {
    set((state) => ({
      lots: state.lots.map((lot) =>
        lot.id === id ? { ...lot, isSelected: !lot.isSelected } : lot,
      ),
    }));
  },
}));

export default useLotStore;
