//useLotStore
import { create } from 'zustand';

import {
  LotComputedInDisplay,
  NeighbourhoodZoneData,
  NeighbourhoodData,
  ZoneData,
} from '../types/types';

interface SelectionState {
  selectedLots: string[];
  selectedZones: string[];
  selectedNeighbourhoods: string[];
}

interface LotStoreState {
  lots: LotComputedInDisplay[];
  neighbourhoodZoneData: NeighbourhoodZoneData;
  selectionState: {
    [screen: string]: SelectionState;
  };

  initializeLots: (lots: LotComputedInDisplay[]) => void;
  initializeNeighbourhoodsAndZones: (data: NeighbourhoodZoneData) => void;

  addLot: (newLot: LotComputedInDisplay) => void;
  addNeighbourhood: (neighbourhood: NeighbourhoodData) => NeighbourhoodData;
  addZoneToNeighbourhood: (neighbourhoodId: string, zone: ZoneData) => ZoneData;
  updateLotLastMowingDate: (lotId: string, date: Date) => void;
  updateLot: (
    lotId: string,
    updatedInfo: Partial<LotComputedInDisplay>,
  ) => void;

  deselectAllLots: (screen: string) => void;
  toggleLotSelection: (
    screen: string,
    lotId: string,
    newState: boolean,
  ) => void;
  toggleZoneSelection: (
    screen: string,
    zoneId: string,
    newState: boolean,
  ) => void;
  toggleNeighbourhoodSelection: (
    screen: string,
    neighbourhoodId: string,
    newState: boolean,
  ) => void;

  toggleNeighbourhoodExpansion: (neighbourhoodId: string) => void;
  expandAllNeighbourhoods: () => void;
  collapseAllNeighbourhoods: () => void;
  toggleZoneExpansion: (zoneId: string) => void;
  collapseAllZones: () => void;
}

// I believe my code would be much simpler if instead of having objects of zonedata and neighbourhoodData, i just had them as separate arrays. but its almost working perfectly so i can do with that for now.
const useLotStore = create<LotStoreState>((set, get) => ({
  lots: [],
  neighbourhoodZoneData: { neighbourhoods: [] },

  // selected lots and zones for each screen
  selectionState: {
    homeScreen: {
      selectedLots: [],
      selectedZones: [],
      selectedNeighbourhoods: [],
    },
    zoneAssignmentScreen: {
      selectedLots: [],
      selectedZones: [],
      selectedNeighbourhoods: [],
    },
    // Add more screens as needed
  },

  initializeLots: (lots: LotComputedInDisplay[]) => {
    set({ lots });
  },

  initializeNeighbourhoodsAndZones: (data: NeighbourhoodZoneData) => {
    set({ neighbourhoodZoneData: data });
  },

  addLot: (newLot: LotComputedInDisplay) => {
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

  updateLotLastMowingDate: (lotId: string, date: Date) => {
    set((state) => ({
      lots: state.lots.map((lot) =>
        lot.lotId === lotId ? { ...lot, lastMowingDate: date } : lot,
      ),
    }));
  },

  updateLot: (lotId: string, updatedInfo: Partial<LotComputedInDisplay>) => {
    set((state) => ({
      lots: state.lots.map((lot) =>
        lot.lotId === lotId ? { ...lot, ...updatedInfo } : lot,
      ),
    }));
  },

  // Toggle neighbourhood expansion
  toggleNeighbourhoodExpansion: (neighbourhoodId: string) => {
    set((state) => ({
      neighbourhoodZoneData: {
        ...state.neighbourhoodZoneData,
        neighbourhoods: state.neighbourhoodZoneData.neighbourhoods.map((n) =>
          n.neighbourhoodId === neighbourhoodId
            ? { ...n, isExpanded: !n.isExpanded }
            : n,
        ),
      },
    }));
  },

  // Expand all neighbourhoods
  expandAllNeighbourhoods: () => {
    set((state) => ({
      neighbourhoodZoneData: {
        ...state.neighbourhoodZoneData,
        neighbourhoods: state.neighbourhoodZoneData.neighbourhoods.map((n) => ({
          ...n,
          isExpanded: true,
        })),
      },
    }));
  },

  // Collapse all neighbourhoods
  collapseAllNeighbourhoods: () => {
    set((state) => ({
      neighbourhoodZoneData: {
        ...state.neighbourhoodZoneData,
        neighbourhoods: state.neighbourhoodZoneData.neighbourhoods.map((n) => ({
          ...n,
          isExpanded: false,
        })),
      },
    }));
  },

  // Toggle zone expansion
  toggleZoneExpansion: (zoneId: string) => {
    set((state) => ({
      neighbourhoodZoneData: {
        ...state.neighbourhoodZoneData,
        neighbourhoods: state.neighbourhoodZoneData.neighbourhoods.map((n) => ({
          ...n,
          zones: n.zones.map((z) =>
            z.zoneId === zoneId ? { ...z, isExpanded: !z.isExpanded } : z,
          ),
        })),
      },
    }));
  },

  // Collapse all zones
  collapseAllZones: () => {
    set((state) => ({
      neighbourhoodZoneData: {
        ...state.neighbourhoodZoneData,
        neighbourhoods: state.neighbourhoodZoneData.neighbourhoods.map((n) => ({
          ...n,
          zones: n.zones.map((z) => ({
            ...z,
            isExpanded: false,
          })),
        })),
      },
    }));
  },

  deselectAllLots: (screen: string) => {
    set((state) => ({
      selectionState: {
        ...state.selectionState,
        [screen]: {
          selectedLots: [],
          selectedZones: [],
          selectedNeighbourhoods: [],
        },
      },
    }));
  },

  // Actions to update selection state per screen
  toggleLotSelection: (screen: string, lotId: string, newState: boolean) => {
    set((state) => {
      const currentSelection = state.selectionState[screen] || {
        selectedLots: [],
        selectedZones: [],
        selectedNeighbourhoods: [],
      };

      const selectedLots = newState
        ? [...currentSelection.selectedLots, lotId]
        : currentSelection.selectedLots.filter((id) => id !== lotId);

      return {
        selectionState: {
          ...state.selectionState,
          [screen]: {
            ...currentSelection,
            selectedLots,
          },
        },
      };
    });
  },

  toggleZoneSelection: (screen: string, zoneId: string, newState: boolean) => {
    set((state) => {
      const currentSelection = state.selectionState[screen] || {
        selectedLots: [],
        selectedZones: [],
        selectedNeighbourhoods: [],
      };

      const selectedZones = newState
        ? [...currentSelection.selectedZones, zoneId]
        : currentSelection.selectedZones.filter((id) => id !== zoneId);

      return {
        selectionState: {
          ...state.selectionState,
          [screen]: {
            ...currentSelection,
            selectedZones,
          },
        },
      };
    });

    // toggle all lots in the zone
    const lotsIdsForSpecificZone = get()
      .lots.filter((lot) => lot.zoneId === zoneId)
      .map((lot) => lot.lotId);

    for (const lotId of lotsIdsForSpecificZone) {
      get().toggleLotSelection(screen, lotId, newState);
    }
  },

  toggleNeighbourhoodSelection: (
    screen: string,
    neighbourhoodId: string,
    newState: boolean,
  ) => {
    set((state) => {
      const currentSelection = state.selectionState[screen] || {
        selectedLots: [],
        selectedZones: [],
        selectedNeighbourhoods: [],
      };

      const selectedNeighbourhoods = newState
        ? [...currentSelection.selectedNeighbourhoods, neighbourhoodId]
        : currentSelection.selectedNeighbourhoods.filter(
            (id) => id !== neighbourhoodId,
          );

      return {
        selectionState: {
          ...state.selectionState,
          [screen]: {
            ...currentSelection,
            selectedNeighbourhoods,
          },
        },
      };
    });

    // toggle all zones in the neighbourhood
    const neighbourhood = get().neighbourhoodZoneData.neighbourhoods.find(
      (n) => n.neighbourhoodId === neighbourhoodId,
    );
    for (const zone of neighbourhood?.zones || []) {
      get().toggleZoneSelection(screen, zone.zoneId, newState);
    }
  },
}));

export default useLotStore;
