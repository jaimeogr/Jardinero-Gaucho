// useCurrentAccountStore.ts

import { create } from 'zustand';

import { UserInterface } from '@/types/types';

interface CurrentAccountStoreState {
  currentUser: UserInterface | null;

  setCurrentUser: (user: UserInterface | null) => void;
}

const useCurrentAccountStore = create<CurrentAccountStoreState>((set) => ({
  currentUser: null,

  setCurrentUser: (user) => {
    set({ currentUser: user });
  },
}));

export default useCurrentAccountStore;
