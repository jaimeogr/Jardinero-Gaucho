import { create } from 'zustand';

import { LotInterface } from '../types/types';

interface LotStoreState {
  lots: LotInterface[];
  initializeLots: (lots: LotInterface[]) => void;
  addLot: (newLot: LotInterface) => void;
  deselectAllLots: () => void;
  toggleLotSelection: (lotId: string) => void;
  toggleZoneSelection: (zoneId: string, newState: boolean) => void;
  toggleNeighbourhoodSelection: (
    neighbourhoodId: string,
    newState: boolean,
  ) => void;
  updateLotLastMowingDate: (lotId: string, date: Date) => void;
  updateLot: (lotId: string, updatedInfo: Partial<LotInterface>) => void;
}

const useLotStore = create<LotStoreState>((set, get) => ({
  lots: [],

  initializeLots: (lots: LotInterface[]) => {
    set({ lots });
  },

  addLot: (newLot: LotInterface) => {
    set((state) => ({
      lots: [...state.lots, newLot],
    }));
  },

  deselectAllLots: () => {
    set((state) => ({
      lots: state.lots.map((lot) => ({
        ...lot,
        lotIsSelected: false,
      })),
    }));
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

  toggleZoneSelection: (zoneId: string, newState: boolean) => {
    set((state) => ({
      lots: state.lots.map((lot) =>
        lot.zoneId === zoneId ? { ...lot, lotIsSelected: newState } : lot,
      ),
    }));
  },

  toggleNeighbourhoodSelection: (
    neighbourhoodId: string,
    newState: boolean,
  ) => {
    set((state) => ({
      lots: state.lots.map((lot) =>
        lot.neighbourhoodId === neighbourhoodId
          ? { ...lot, lotIsSelected: newState }
          : lot,
      ),
    }));
  },

  updateLotLastMowingDate: (lotId: string, date: Date) => {
    set((state) => ({
      lots: state.lots.map((lot) =>
        lot.lotId === lotId ? { ...lot, lastMowingDate: date } : lot,
      ),
    }));
  },

  updateLot: (lotId: string, updatedInfo: Partial<LotInterface>) => {
    set((state) => ({
      lots: state.lots.map((lot) =>
        lot.lotId === lotId ? { ...lot, ...updatedInfo } : lot,
      ),
    }));
  },
}));

export default useLotStore;
