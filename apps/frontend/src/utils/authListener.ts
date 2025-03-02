// authListener.ts
import supabase from '@/api/supabase/client';
import { refreshCurrentAccount } from '@/services/accountService';
import useCurrentAccountStore from '@/stores/useCurrentAccountStore';
import { UserInterface } from '@/types/types';

// This functions keeps the currentUser state in sync with the user's authentication state from the supabase client by using a listener.
const authListener = () => {
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      console.log('onAuthStateChange - current user exists.');
      try {
        await refreshCurrentAccount(session.user.id);
      } catch (error) {
        console.error('Error initializing user data:', error);
      } finally {
        useCurrentAccountStore.getState().setAuthLoaded(true);
      }
    } else {
      useCurrentAccountStore.getState().setCurrentUser(null);
      useCurrentAccountStore.getState().setAuthLoaded(true);
    }
  });
};

// Call this function in your app's entry point (e.g., App.js or index.js)
export default authListener;
