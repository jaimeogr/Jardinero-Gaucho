// UserService.ts
import BackendService from '../backend/BackendService';
import useUserStore from '../stores/useUserStore';
import { UserInterface } from '../types/types';

const initializeUsers = () => {
  const currentUser = BackendService.getMyUser();

  const usersFromAllMyWorkgroups: UserInterface[] =
    BackendService.getUsersFromAllMyWorkgroups();

  useUserStore.getState().initializeUsers(usersFromAllMyWorkgroups);
  useUserStore.getState().setCurrentUser(currentUser);
};

const useGetCurrentUser = () => {
  const currentUser = useUserStore((state) => state.currentUser);
  return currentUser;
};

export default {
  initializeUsers,
  useGetCurrentUser,
};
