// useZoneAssignmentScreenStore.ts
import { create } from 'zustand';

interface ZoneAssignmentScreenState {
  selectedLots: Set<string>;
  expandedZones: Set<string>;
  expandedNeighbourhoods: Set<string>;

  // Actions for selections
  toggleSelectionForSingleLot: (lotId: string, newState: boolean) => void;
  toggleSelectionForLotsArray: (lotIds: string[], newState: boolean) => void;
  deselectLots: (lotIds: string[]) => void;
  deselectAllLots: () => void;

  // Actions for zone expansions / collapsing
  toggleZoneExpansion: (zoneId: string) => void;
  collapseAllZones: () => void;

  // Actions for neighbourhoods expansions / collapsing
  toggleNeighbourhoodExpansion: (neighbourhoodId: string) => void;
  collapseAllNeighbourhoods: () => void;
  expandAllNeighbourhoods: (neighbourhoodIds: string[]) => void;
}

const useZoneAssignmentScreenStore = create<ZoneAssignmentScreenState>(
  (set, get) => ({
    selectedLots: new Set<string>(),
    expandedZones: new Set<string>(),
    expandedNeighbourhoods: new Set<string>(),

    // Actions for selections
    toggleSelectionForSingleLot: (lotId, newState) => {
      set((state) => {
        const selectedLots = new Set(state.selectedLots);
        if (newState) {
          selectedLots.add(lotId);
        } else {
          selectedLots.delete(lotId);
        }
        return { selectedLots };
      });
    },
    toggleSelectionForLotsArray: (lotIds, newState) => {
      set((state) => {
        const selectedLots = new Set(state.selectedLots);
        lotIds.forEach((id) => {
          if (newState) {
            selectedLots.add(id);
          } else {
            selectedLots.delete(id);
          }
        });
        return { selectedLots };
      });
    },
    deselectLots: (lotIds) => {
      set((state) => {
        const selectedLots = new Set(state.selectedLots);
        lotIds.forEach((id) => selectedLots.delete(id));
        return { selectedLots };
      });
    },
    deselectAllLots: () => {
      set(() => ({
        selectedLots: new Set(),
      }));
    },

    // Actions for zone expansions / collapsing
    toggleZoneExpansion: (zoneId) => {
      set((state) => {
        const expandedZones = new Set(state.expandedZones);
        if (expandedZones.has(zoneId)) {
          expandedZones.delete(zoneId);
        } else {
          expandedZones.add(zoneId);
        }
        return { expandedZones };
      });
    },
    collapseAllZones: () => {
      set(() => ({
        expandedZones: new Set(),
      }));
    },

    // Actions for neighbourhoods expansions / collapsing
    toggleNeighbourhoodExpansion: (neighbourhoodId) => {
      set((state) => {
        const expandedNeighbourhoods = new Set(state.expandedNeighbourhoods);
        if (expandedNeighbourhoods.has(neighbourhoodId)) {
          expandedNeighbourhoods.delete(neighbourhoodId);
        } else {
          expandedNeighbourhoods.add(neighbourhoodId);
        }
        return { expandedNeighbourhoods };
      });
    },
    collapseAllNeighbourhoods: () => {
      set(() => ({
        expandedNeighbourhoods: new Set(),
      }));
    },
    expandAllNeighbourhoods: (neighbourhoodIds) => {
      set(() => ({
        expandedNeighbourhoods: new Set(neighbourhoodIds),
      }));
    },
  }),
);

export default useZoneAssignmentScreenStore;
