// UserStore.ts
import { create } from 'zustand';

import { UserInterface } from '../types/types';

interface UserStoreState {
  users: UserInterface[];
  initializeUsers: (users: UserInterface[]) => void;
  setUsers: (users: UserInterface[]) => void;
  getUserById: (id: number) => UserInterface | undefined;
  addUser: (user: UserInterface) => void;
  updateUser: (id: number, updatedInfo: Partial<UserInterface>) => void;
  removeUser: (id: number) => void;
}

const useUserStore = create<UserStoreState>((set, get) => ({
  users: [],
  initializeUsers: (users: UserInterface[]) => {
    set({ users });
  },
  setUsers: (users: UserInterface[]) => {
    set({ users });
  },
  getUserById: (id: number) => {
    return get().users.find((user) => user.id === id);
  },
  addUser: (user: UserInterface) => {
    set((state) => ({ users: [...state.users, user] }));
  },
  updateUser: (id: number, updatedInfo: Partial<UserInterface>) => {
    set((state) => ({
      users: state.users.map((user) =>
        user.id === id ? { ...user, ...updatedInfo } : user,
      ),
    }));
  },
  removeUser: (id: number) => {
    set((state) => ({
      users: state.users.filter((user) => user.id !== id),
    }));
  },
}));

export default useUserStore;
