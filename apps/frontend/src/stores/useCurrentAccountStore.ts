// useCurrentAccountStore.ts
import { create } from 'zustand';

import { UserInterface } from '@/types/types';

interface CurrentAccountStoreState {
  currentUser: UserInterface | null;
  authLoaded: boolean;
  setCurrentUser: (user: UserInterface | null) => void;
  setAuthLoaded: (loaded: boolean) => void;
}

const useCurrentAccountStore = create<CurrentAccountStoreState>((set, get) => ({
  currentUser: null,
  authLoaded: false,

  setCurrentUser: (user) => {
    set({ currentUser: user });
  },

  setAuthLoaded: (loaded) => {
    set({ authLoaded: loaded });
  },
}));

export default useCurrentAccountStore;
