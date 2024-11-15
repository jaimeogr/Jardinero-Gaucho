// useUserService.ts
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

const getUserById = (userId: string): UserInterface | undefined => {
  return useUserStore.getState().getUserById(userId);
};

const useAllUsers = (): UserInterface[] => {
  const allUsers = useUserStore((state) => state.users);
  return allUsers;
};

const addUser = (user: UserInterface) => {
  useUserStore.getState().addUser(user);
};

const updateUser = (userId: string, updatedInfo: Partial<UserInterface>) => {
  useUserStore.getState().updateUser(userId, updatedInfo);
};

export default {
  initializeUsers,
  useGetCurrentUser,
  getUserById,
  useAllUsers,
  addUser,
  updateUser,
};
