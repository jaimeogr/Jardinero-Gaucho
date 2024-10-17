// UserService.ts
import DatabaseService from './DatabaseService';
import useUserStore from '../stores/useUserStore';
import { UserInterface } from '../types/types';

const initializeUsers = () => {
  const currentUser = DatabaseService.getMyUser();

  const usersFromAllMyWorkgroups: UserInterface[] =
    DatabaseService.getUsersFromAllMyWorkgroups();

  useUserStore.getState().initializeUsers(usersFromAllMyWorkgroups);
  useUserStore.getState().setCurrentUser(currentUser);
};

export default {
  initializeUsers,
};
