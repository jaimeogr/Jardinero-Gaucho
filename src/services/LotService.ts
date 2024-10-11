import React from 'react';

import useLotStore from '../stores/useLotStore';
import {
  LotInterface,
  LotWithNeedMowingInterface,
  ZoneInterface,
  NeighbourhoodInterface,
} from '../types/types';
import { lotNeedsMowing } from '../utils/DateAnalyser';

const hardCodedLots: LotInterface[] = [
  {
    id: 0,
    number: '106',
    zone: '1',
    neighbourhood: 'El Canton',
    lastMowingDate: new Date('2024-10-03'),
    isSelected: false,
  },
  {
    id: 1,
    number: '200',
    zone: '2',
    neighbourhood: 'El Canton',
    lastMowingDate: new Date('2024-10-02'),
    // extraNotes: 'The Gingko Biloba needs pruning',
    isSelected: false,
  },
  {
    id: 2,
    number: '201',
    zone: '2',
    neighbourhood: 'El Canton',
    lastMowingDate: new Date('2024-10-03'),
    isSelected: false,
  },
  {
    id: 3,
    number: '202',
    zone: '2',
    neighbourhood: 'El Canton',
    lastMowingDate: new Date('2024-09-27'),
    isSelected: false,
  },
  {
    id: 4,
    number: '202',
    zone: '2',
    neighbourhood: 'El Canton',
    lastMowingDate: new Date('2024-10-02'),
    isSelected: false,
  },
  {
    id: 5,
    number: '202',
    zone: '2',
    neighbourhood: 'El Canton',
    lastMowingDate: new Date('2024-09-29'),
    isSelected: false,
  },
  {
    id: 6,
    number: '101',
    zone: '1',
    neighbourhood: 'El Canton',
    lastMowingDate: new Date('2024-09-29'),
    isSelected: false,
  },
  {
    id: 7,
    number: '102',
    zone: '1',
    neighbourhood: 'El Canton',
    lastMowingDate: new Date('2024-09-30'),
    isSelected: false,
  },
  {
    id: 8,
    number: '103',
    zone: '1',
    neighbourhood: 'El Canton',
    lastMowingDate: new Date('2024-09-30'),
    isSelected: false,
  },
  {
    id: 9,
    number: '104',
    zone: '1',
    neighbourhood: 'El Canton',
    lastMowingDate: new Date('2024-10-01'),
    isSelected: false,
  },
  {
    id: 10,
    number: '105',
    zone: '1',
    neighbourhood: 'El Canton',
    lastMowingDate: new Date('2024-10-02'),
    isSelected: false,
  },
  {
    id: 11,
    number: '107',
    zone: '1',
    neighbourhood: 'El Canton',
    lastMowingDate: new Date('2024-10-03'),
    isSelected: false,
  },
  {
    id: 12,
    number: '108',
    zone: '1',
    neighbourhood: 'El Canton',
    lastMowingDate: new Date('2024-10-01'),
    isSelected: false,
  },
  {
    id: 13,
    number: '109',
    zone: '1',
    neighbourhood: 'El Canton',
    lastMowingDate: new Date('2024-10-04'),
    isSelected: false,
  },
  {
    id: 14,
    number: '110',
    zone: '1',
    neighbourhood: 'El Canton',
    lastMowingDate: new Date('2024-10-04'),
    isSelected: false,
  },
  {
    id: 15,
    number: '111',
    zone: '1',
    neighbourhood: 'El Canton',
    lastMowingDate: new Date('2024-10-04'),
    isSelected: false,
  },
  {
    id: 16,
    number: '506',
    zone: '3',
    neighbourhood: 'La Laguna',
    lastMowingDate: new Date('2024-09-25'),
    isSelected: false,
  },
  {
    id: 17,
    number: '507',
    zone: '3',
    neighbourhood: 'La Laguna',
    lastMowingDate: new Date('2024-10-02'),
    isSelected: false,
  },
  {
    id: 18,
    number: '508',
    zone: '3',
    neighbourhood: 'La Laguna',
    lastMowingDate: new Date('2024-10-03'),
    isSelected: false,
  },
  {
    id: 19,
    number: '509',
    zone: '3',
    neighbourhood: 'La Laguna',
    lastMowingDate: new Date('2024-09-30'),
    isSelected: false,
  },
  {
    id: 20,
    number: '510',
    zone: '3',
    neighbourhood: 'La Laguna',
    lastMowingDate: new Date('2024-09-23'),
    isSelected: false,
  },
  {
    id: 21,
    number: '511',
    zone: '3',
    neighbourhood: 'La Laguna',
    lastMowingDate: new Date('2024-09-24'),
    isSelected: false,
  },
  {
    id: 22,
    number: '506',
    zone: '3',
    neighbourhood: 'La Laguna',
    lastMowingDate: new Date('2024-09-25'),
    isSelected: false,
  },
  {
    id: 23,
    number: '707',
    zone: '7',
    neighbourhood: 'El Tero',
    lastMowingDate: new Date('2024-10-01'),
    isSelected: false,
  },
  {
    id: 24,
    number: '708',
    zone: '7',
    neighbourhood: 'El Tero',
    lastMowingDate: new Date('2024-10-01'),
    isSelected: false,
  },
  {
    id: 25,
    number: '709',
    zone: '7',
    neighbourhood: 'El Tero',
    lastMowingDate: new Date('2024-10-02'),
    isSelected: false,
  },
  {
    id: 26,
    number: '54',
    zone: '1',
    neighbourhood: 'El Naudir',
    lastMowingDate: new Date('2024-10-03'),
    isSelected: false,
  },
  {
    id: 27,
    number: '55',
    zone: '1',
    neighbourhood: 'El Naudir',
    lastMowingDate: new Date('2024-10-02'),
    isSelected: false,
  },
  {
    id: 28,
    number: '56',
    zone: '1',
    neighbourhood: 'El Naudir',
    lastMowingDate: new Date('2024-10-02'),
    isSelected: false,
  },
  {
    id: 29,
    number: '57',
    zone: '1',
    neighbourhood: 'El Naudir',
    lastMowingDate: new Date('2024-10-03'),
    isSelected: false,
  },
];

export const useZonesOptions = (): NeighbourhoodInterface[] => {
  const lots = useLotStore((state) => state.lots);

  return React.useMemo<NeighbourhoodInterface[]>(() => {
    const result: NeighbourhoodInterface[] = [];

    // Group lots by neighbourhood and zone
    const lotsByNeighbourhoodAndZone = lots.reduce(
      (acc, lot) => {
        const { neighbourhood, zone } = lot;

        if (!acc[neighbourhood]) {
          acc[neighbourhood] = {};
        }

        if (!acc[neighbourhood][zone]) {
          acc[neighbourhood][zone] = [];
        }

        acc[neighbourhood][zone].push(lot);
        return acc;
      },
      {} as Record<string, Record<string, LotInterface[]>>,
    );

    // Iterate over each neighbourhood
    for (const neighbourhood in lotsByNeighbourhoodAndZone) {
      let neighbourhoodNeedMowingCritically = 0;
      let neighbourhoodNeedMowing = 0;
      let neighbourhoodDoesntNeedMowing = 0;

      const zones: ZoneInterface[] = [];

      // Iterate over each zone within the neighbourhood
      for (const zone in lotsByNeighbourhoodAndZone[neighbourhood]) {
        const lotsInZone = lotsByNeighbourhoodAndZone[neighbourhood][zone];
        let zoneNeedMowingCritically = 0;
        let zoneNeedMowing = 0;
        let zoneDoesntNeedMowing = 0;

        const lots: LotWithNeedMowingInterface[] = lotsInZone.map((lot) => {
          const needsMowing = lotNeedsMowing(lot.lastMowingDate);

          if (needsMowing === 2) {
            zoneNeedMowingCritically++;
          } else if (needsMowing === 1) {
            zoneNeedMowing++;
          } else {
            zoneDoesntNeedMowing++;
          }

          return {
            ...lot,
            needMowing: needsMowing,
          };
        });

        neighbourhoodNeedMowingCritically += zoneNeedMowingCritically;
        neighbourhoodNeedMowing += zoneNeedMowing;
        neighbourhoodDoesntNeedMowing += zoneDoesntNeedMowing;

        const zoneOption: ZoneInterface = {
          zone,
          zoneId: zone,
          needMowingCritically: zoneNeedMowingCritically,
          needMowing: zoneNeedMowing,
          doesntNeedMowing: zoneDoesntNeedMowing,
          isSelected: false, // Initialize as needed
          lots,
        };

        zones.push(zoneOption);
      }

      const neighbourhoodOption: NeighbourhoodInterface = {
        neighbourhood,
        neighbourhoodId: neighbourhood,
        needMowingCritically: neighbourhoodNeedMowingCritically,
        needMowing: neighbourhoodNeedMowing,
        doesntNeedMowing: neighbourhoodDoesntNeedMowing,
        isSelected: false, // Initialize as needed
        zones,
      };

      result.push(neighbourhoodOption);
    }

    return result;
  }, [lots]);
};

const initializeLots = () => {
  useLotStore.getState().initializeLots(hardCodedLots);
};

const setSelected = (id: number) => {
  useLotStore.getState().toggleLotSelection(id);
};

export default {
  initializeLots,
  setSelected,
  useZonesOptions,
};
