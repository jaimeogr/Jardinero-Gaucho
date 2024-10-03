// DataService.ts
import { LotInterface } from '../types/types';

const lotsForToday: LotInterface[] = [
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

export default {
  getLotsForToday: (): LotInterface[] => {
    return lotsForToday;
  },
};
