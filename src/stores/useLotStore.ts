//useLotStore
import { create } from 'zustand';

import { NeighbourhoodZoneData, NeighbourhoodData, ZoneData, LotInStore } from '../types/types';

interface LotStoreState {
  lots: LotInStore[];
  neighbourhoodZoneData: NeighbourhoodZoneData;

  initializeLots: (lots: LotInStore[]) => void;
  initializeNeighbourhoodsAndZones: (data: NeighbourhoodZoneData) => void;

  addLot: (newLot: LotInStore) => void;
  addNeighbourhood: (neighbourhood: NeighbourhoodData) => NeighbourhoodData;
  addZoneToNeighbourhood: (neighbourhoodId: string, zone: ZoneData) => ZoneData;
  updateLotLastMowingDate: (lotId: string, date: Date) => void;
  updateLot: (lotId: string, updatedInfo: Partial<LotInStore>) => void;
}

// I believe my code would be much simpler if instead of having objects of zonedata and neighbourhoodData, i just had them as separate arrays. but its almost working perfectly so i can do with that for now.
const useLotStore = create<LotStoreState>((set, get) => ({
  lots: [],
  neighbourhoodZoneData: { neighbourhoods: [] },

  initializeLots: (lots: LotInStore[]) => {
    set({ lots });
  },

  initializeNeighbourhoodsAndZones: (data: NeighbourhoodZoneData) => {
    set({ neighbourhoodZoneData: data });
  },

  addLot: (newLot: LotInStore) => {
    set((state) => ({
      lots: [...state.lots, newLot],
    }));
  },

  addNeighbourhood: (neighbourhood) => {
    set((state) => ({
      neighbourhoodZoneData: {
        neighbourhoods: [...state.neighbourhoodZoneData.neighbourhoods, neighbourhood],
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

  updateLotLastMowingDate: (lotId: string, date: Date) => {
    set((state) => ({
      lots: state.lots.map((lot) => (lot.lotId === lotId ? { ...lot, lastMowingDate: date } : lot)),
    }));
  },

  updateLot: (lotId: string, updatedInfo: Partial<LotInStore>) => {
    set((state) => ({
      lots: state.lots.map((lot) => (lot.lotId === lotId ? { ...lot, ...updatedInfo } : lot)),
    }));
  },
}));

export default useLotStore;
