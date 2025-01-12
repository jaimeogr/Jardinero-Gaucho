// src/stores/useUserStore.ts

import { create } from 'zustand';

import { UserInterface, UserRole, TemporaryUserData } from '@/types/types';

interface UserStoreState {
  users: UserInterface[];
  initializeUsers: (users: UserInterface[]) => void;
  getUserById: (id: string) => UserInterface | undefined;
  addUser: (user: UserInterface) => void;
  updateUser: (id: string, updatedInfo: Partial<UserInterface>) => void;
  removeUser: (id: string) => void;
  currentUser: UserInterface | null;
  setCurrentUser: (user: UserInterface | null) => void;

  // Temporary navigation props
  TemporaryUserData: TemporaryUserData | null;
  TemporaryisNewUser: boolean;
  setTemporaryUserData: (data: TemporaryUserData | null) => void;
  setTemporaryIsNewUser: (isNew: boolean) => void;
}

const useUserStore = create<UserStoreState>((set, get) => ({
  users: [],
  currentUser: null,
  TemporaryUserData: null,
  TemporaryisNewUser: false,

  initializeUsers: (users: UserInterface[]) => {
    set({ users });
  },
  getUserById: (id: string) => {
    return get().users.find((user) => user.userId === id);
  },
  addUser: (user: UserInterface) => {
    set((state) => ({ users: [...state.users, user] }));
  },
  updateUser: (id: string, updatedInfo: Partial<UserInterface>) => {
    set((state) => ({
      users: state.users.map((user) => (user.userId === id ? { ...user, ...updatedInfo } : user)),
    }));
  },
  removeUser: (id: string) => {
    set((state) => ({
      users: state.users.filter((user) => user.userId !== id),
    }));
  },
  setCurrentUser: (user: UserInterface | null) => {
    set({ currentUser: user });
  },

  // Set temporary navigation props
  setTemporaryUserData: (data) => set({ TemporaryUserData: data }),
  setTemporaryIsNewUser: (isNew) => set({ TemporaryisNewUser: isNew }),
}));

export default useUserStore;
