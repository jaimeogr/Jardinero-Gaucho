// DataService.ts
import { LotInterface } from '../types/types';
import { lotNeedsMowing } from '../utils/DateAnalyser';

const allLots: LotInterface[] = [
  {
    number: '200',
    zone: '2',
    neighbourhood: 'El Canton',
    lastMowingDate: new Date('2024-10-02'),
    extraNotes: 'The Gingko Biloba needs pruning',
  },
  {
    number: '201',
    zone: '2',
    neighbourhood: 'El Canton',
    lastMowingDate: new Date('2024-09-23'),
  },
  {
    number: '202',
    zone: '2',
    neighbourhood: 'El Canton',
    lastMowingDate: new Date('2024-09-27'),
  },
  {
    number: '202',
    zone: '2',
    neighbourhood: 'El Canton',
    lastMowingDate: new Date('2024-09-28'), //saturday hardoced for extreme testing
  },
  {
    number: '202',
    zone: '2',
    neighbourhood: 'El Canton',
    lastMowingDate: new Date('2024-09-29'), //sunday hardoced for extreme testing
  },
  {
    number: '506',
    zone: '3',
    neighbourhood: 'La Laguna',
    lastMowingDate: new Date('2024-10-01'),
  },
  {
    number: '507',
    zone: '3',
    neighbourhood: 'La Laguna',
    lastMowingDate: new Date('2024-10-02'),
  },
  {
    number: '508',
    zone: '3',
    neighbourhood: 'La Laguna',
    lastMowingDate: new Date('2024-10-03'),
  },
  {
    number: '509',
    zone: '3',
    neighbourhood: 'La Laguna',
    lastMowingDate: new Date('2024-09-30'),
  },
  {
    number: '510',
    zone: '3',
    neighbourhood: 'La Laguna',
    lastMowingDate: new Date('2024-09-23'),
  },
  {
    number: '511',
    zone: '3',
    neighbourhood: 'La Laguna',
    lastMowingDate: new Date('2024-09-24'),
  },
  {
    number: '506',
    zone: '3',
    neighbourhood: 'La Laguna',
    lastMowingDate: new Date('2024-09-25'),
  },
  {
    number: '707',
    zone: '7',
    neighbourhood: 'El Tero',
    lastMowingDate: new Date('2024-10-01'),
  },
  {
    number: '708',
    zone: '7',
    neighbourhood: 'El Tero',
    lastMowingDate: new Date('2024-10-01'),
  },
  {
    number: '709',
    zone: '7',
    neighbourhood: 'El Tero',
    lastMowingDate: new Date('2024-10-02'),
  },
  {
    number: '54',
    zone: '1',
    neighbourhood: 'El Naudir',
    lastMowingDate: new Date('2024-10-03'),
  },
  {
    number: '55',
    zone: '1',
    neighbourhood: 'El Naudir',
    lastMowingDate: new Date('2024-10-02'),
  },
  {
    number: '56',
    zone: '1',
    neighbourhood: 'El Naudir',
    lastMowingDate: new Date('2024-10-02'),
  },
  {
    number: '57',
    zone: '1',
    neighbourhood: 'El Naudir',
    lastMowingDate: new Date('2024-10-03'),
  },
];

const getZonesOptions = () => {
  const result: {
    neighbourhood: string;
    needMowing: number;
    doesntNeedMowing: number;
  }[] = [];

  // Group lots by neighbourhood
  const lotsByNeighbourhood: Record<string, LotInterface[]> = allLots.reduce(
    (acc, lot) => {
      if (!acc[lot.neighbourhood]) {
        acc[lot.neighbourhood] = [];
      }
      acc[lot.neighbourhood].push(lot);
      return acc;
    },
    {} as Record<string, LotInterface[]>,
  );

  // Iterate over each neighbourhood and calculate needMowing and doesntNeedMowing
  for (const neighbourhood in lotsByNeighbourhood) {
    const lots = lotsByNeighbourhood[neighbourhood];
    let needMowing = 0;
    let doesntNeedMowing = 0;

    lots.forEach((lot) => {
      if (lotNeedsMowing(lot.lastMowingDate)) {
        needMowing++;
      } else {
        doesntNeedMowing++;
      }
    });

    result.push({
      neighbourhood,
      needMowing,
      doesntNeedMowing,
    });
  }

  return result;
};

export default {
  getLotsForToday: (): LotInterface[] => {
    return allLots;
  },

  // Directly export the function without wrapping
  getZonesOptions,

  getAllLots: () => {
    return allLots;
  },
};
