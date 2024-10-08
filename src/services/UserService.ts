import { UserInterface } from '../types/types';

const myTeam: UserInterface[] = [
  {
    id: 1,
    firstName: 'Cristian',
    lastName: 'Alvarez',
    email: 'cajardineria@gmail.com',
  },
  {
    id: 2,
    firstName: 'pedro',
    lastName: 'Abigail',
    email: 'pabigail@gmail.com',
  },
  {
    id: 3,
    firstName: 'dibu',
    lastName: 'martinez',
    email: 'dibumartinez@gmail.com',
  },
];

export default {
  getMyTeam: (): UserInterface[] => {
    return myTeam;
  },
};
