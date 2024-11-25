import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

// useUserService.ts
import BackendService from '../backend/BackendService';
import useUserStore from '../stores/useUserStore';
import { UserInterface, TemporaryUserData } from '../types/types';

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

const updateUserAccessToAllLots = (
  userId: string,
  accessToAllLots: boolean,
  activeWorkgroupId: string,
) => {
  const user = getUserById(userId);
  if (user) {
    const assignmentIndex = user.workgroupAssignments.findIndex(
      (wa) => wa.workgroupId === activeWorkgroupId,
    );
    if (assignmentIndex >= 0) {
      user.workgroupAssignments[assignmentIndex].accessToAllLots =
        accessToAllLots;
      updateUser(userId, user);
    }
  }
};

const getTemporaryUserData = (): {
  temporaryUserData: TemporaryUserData | null;
  temporaryisNewUser: boolean;
} => {
  const temporaryUserData = useUserStore.getState().TemporaryUserData;
  const temporaryisNewUser = useUserStore.getState().TemporaryisNewUser;
  return { temporaryUserData, temporaryisNewUser };
};

export default {
  initializeUsers,
  useGetCurrentUser,
  getUserById,
  useAllUsers,
  addUser,
  updateUser,
  updateUserAccessToAllLots,
  getTemporaryUserData,
};
