// DataService.ts
import lotStore from '../stores/LotStore';
import { LotInterface } from '../types/types';
import { lotNeedsMowing } from '../utils/DateAnalyser';

const hardCodedLots: LotInterface[] = [
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
    id: 10,
    number: '106',
    zone: '1',
    neighbourhood: 'El Canton',
    lastMowingDate: new Date('2024-10-03'),
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

const getZonesOptions = () => {
  const result: {
    neighbourhood: string;
    zones: {
      zone: string;
      needMowing: number;
      doesntNeedMowing: number;
      lots: {
        number: string;
        needMowing: boolean;
        lastMowingDate: Date;
      }[];
    }[];
    needMowing: number;
    doesntNeedMowing: number;
  }[] = [];

  // Group lots by neighbourhood, and then by zone within each neighbourhood
  const lotsByNeighbourhoodAndZone = lotStore.lots.reduce(
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
    let neighbourhoodNeedMowing = 0;
    let neighbourhoodDoesntNeedMowing = 0;

    // Iterate over each zone for each neighbourhood.
    const zones = Object.keys(lotsByNeighbourhoodAndZone[neighbourhood]).map(
      (zone) => {
        const lotsInZone = lotsByNeighbourhoodAndZone[neighbourhood][zone];
        let zoneNeedMowing = 0;
        let zoneDoesntNeedMowing = 0;

        const lots = lotsInZone.map((lot) => {
          const needsMowing = lotNeedsMowing(lot.lastMowingDate);

          if (needsMowing) {
            zoneNeedMowing++;
          } else {
            zoneDoesntNeedMowing++;
          }

          return {
            number: lot.number,
            needMowing: needsMowing,
            lastMowingDate: lot.lastMowingDate,
          };
        });

        neighbourhoodNeedMowing += zoneNeedMowing;
        neighbourhoodDoesntNeedMowing += zoneDoesntNeedMowing;

        return {
          zone,
          needMowing: zoneNeedMowing,
          doesntNeedMowing: zoneDoesntNeedMowing,
          lots,
        };
      },
    );

    result.push({
      neighbourhood,
      zones,
      needMowing: neighbourhoodNeedMowing,
      doesntNeedMowing: neighbourhoodDoesntNeedMowing,
    });
  }

  return result;
};

const setSelected = (id: number) => {
  lotStore.toggleLotSelection(id);
};

export default {
  getAllLots: () => {
    return lotStore.lots;
  },

  getFirstLoadOfLots: () => {
    return hardCodedLots;
  },

  setLots: (lots: LotInterface[]) => {
    lotStore.setLots(lots);
  },

  getZonesOptions,

  setSelected,
};
