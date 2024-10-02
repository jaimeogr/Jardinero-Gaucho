// DataService.ts
import { ScrollableItemProps } from '../types/types';

const lotsForToday: ScrollableItemProps[] = [
  {
    number: '200',
    zone: '2',
    neighbourhood: 'El Canton',
    completed: false,
    extraNotes: 'The Gingko Biloba needs pruning',
  },
  {
    number: '201',
    zone: '2',
    neighbourhood: 'El Canton',
    completed: false,
  },
  {
    number: '202',
    zone: '2',
    neighbourhood: 'El Canton',
    completed: true,
  },
  {
    number: '506',
    zone: '3',
    neighbourhood: 'La Laguna',
    completed: true,
  },
  {
    number: '507',
    zone: '3',
    neighbourhood: 'La Laguna',
    completed: false,
  },
  {
    number: '508',
    zone: '3',
    neighbourhood: 'La Laguna',
    completed: false,
  },
  {
    number: '509',
    zone: '3',
    neighbourhood: 'La Laguna',
    completed: false,
  },
  {
    number: '510',
    zone: '3',
    neighbourhood: 'La Laguna',
    completed: false,
  },
  {
    number: '511',
    zone: '3',
    neighbourhood: 'La Laguna',
    completed: false,
  },
  {
    number: '506',
    zone: '3',
    neighbourhood: 'La Laguna',
    completed: true,
  },
  {
    number: '707',
    zone: '7',
    neighbourhood: 'El Tero',
    completed: false,
  },
  {
    number: '708',
    zone: '7',
    neighbourhood: 'El Tero',
    completed: false,
  },
  {
    number: '709',
    zone: '7',
    neighbourhood: 'El Tero',
    completed: false,
  },
  {
    number: '54',
    zone: '1',
    neighbourhood: 'El Naudir',
    completed: false,
  },
  {
    number: '55',
    zone: '1',
    neighbourhood: 'El Naudir',
    completed: false,
  },
  {
    number: '56',
    zone: '1',
    neighbourhood: 'El Naudir',
    completed: false,
  },
  {
    number: '57',
    zone: '1',
    neighbourhood: 'El Naudir',
    completed: false,
  },
];

export default {
  getLotsForToday: (): ScrollableItemProps[] => {
    return lotsForToday;
  },
};
