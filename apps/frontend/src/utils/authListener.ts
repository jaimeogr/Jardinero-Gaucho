// authListener.ts
import supabase from '@/api/supabase/client';
import { refreshCurrentAccount, devAutoLogin } from '@/services/accountService';
import useCurrentAccountStore from '@/stores/useCurrentAccountStore';

// This functions keeps the currentUser state in sync with the user's authentication state from the supabase client by using a listener.
const authListener = () => {
  supabase.auth.onAuthStateChange(async (event, session) => {
    if (session?.user) {
      // user exists
      console.log('onAuthStateChange - current user exists.');
      try {
        await refreshCurrentAccount(session.user.id);
      } catch (error) {
        console.error('Error initializing user data:', error);
      } finally {
        useCurrentAccountStore.getState().setAuthLoaded(true);
      }
    } else if (process.env.EXPO_PUBLIC_SKIP_SIGNIN_SCREEN === 'true') {
      // used does not exist, and its expected to sign in with the dev account
      console.log('onAuthStateChange - current user does not exist. Attempting dev auto-login.');
      try {
        await devAutoLogin();
      } catch (error) {
        console.error('Error attempting dev auto-login:', error);
      } finally {
        useCurrentAccountStore.getState().setAuthLoaded(true);
      }
    } else {
      // user does not exist
      useCurrentAccountStore.getState().setCurrentUser(null);
      useCurrentAccountStore.getState().setAuthLoaded(true);
    }
  });
};

// Call this function in your app's entry point (e.g., App.js or index.js)
export default authListener;
