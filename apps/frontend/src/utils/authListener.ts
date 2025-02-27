// authListener.ts
import { refreshCurrentAccount } from '@/services/accountService';
import useCurrentAccountStore from '@/stores/useCurrentAccountStore';
import { UserInterface } from '@/types/types';
import supabase from '@/api/supabase/client';

// This functions keeps the currentUser state in sync with the user's authentication state from the supabase client by using a listener.
const authListener = () => {
  supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      (async () => {
        console.log('onAuthStateChange');
        await refreshCurrentAccount(session.user.id);
        useCurrentAccountStore.getState().setAuthLoaded(true);
      })();
    } else {
      useCurrentAccountStore.getState().setCurrentUser(null);
      useCurrentAccountStore.getState().setAuthLoaded(true);
    }
  });
};

// Call this function in your app's entry point (e.g., App.js or index.js)
export default authListener;
