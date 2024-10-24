//useLotStore
import { create } from 'zustand';

import {
  LotInterface,
  NeighbourhoodZoneData,
  NeighbourhoodData,
  ZoneData,
} from '../types/types';

interface LotStoreState {
  lots: LotInterface[];
  neighbourhoodZoneData: NeighbourhoodZoneData;
  initializeLots: (lots: LotInterface[]) => void;
  initializeNeighbourhoodsAndZones: (data: NeighbourhoodZoneData) => void;
  addLot: (newLot: LotInterface) => void;
  addNeighbourhood: (neighbourhood: NeighbourhoodData) => NeighbourhoodData;
  addZoneToNeighbourhood: (neighbourhoodId: string, zone: ZoneData) => ZoneData;
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
  neighbourhoodZoneData: { neighbourhoods: [] },

  initializeLots: (lots: LotInterface[]) => {
    set({ lots });
  },

  initializeNeighbourhoodsAndZones: (data: NeighbourhoodZoneData) => {
    set({ neighbourhoodZoneData: data });
  },

  addLot: (newLot: LotInterface) => {
    set((state) => ({
      lots: [...state.lots, newLot],
    }));
  },

  addNeighbourhood: (neighbourhood) => {
    set((state) => ({
      neighbourhoodZoneData: {
        neighbourhoods: [
          ...state.neighbourhoodZoneData.neighbourhoods,
          neighbourhood,
        ],
      },
    }));
    return neighbourhood;
  },

  addZoneToNeighbourhood: (neighbourhoodId, zone) => {
    set((state) => ({
      neighbourhoodZoneData: {
        neighbourhoods: state.neighbourhoodZoneData.neighbourhoods.map((n) => {
          if (n.neighbourhoodId === neighbourhoodId) {
            return {
              ...n,
              zones: [...n.zones, zone],
            };
          }
          return n;
        }),
      },
    }));
    return zone;
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
