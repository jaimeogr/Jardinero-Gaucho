// authListener.ts
import useCurrentAccountStore from '@/stores/useCurrentAccountStore';
import { UserInterface } from '@/types/types';
import supabase from '@/utils/supabase';

// This functions keeps the currentUser state in sync with the user's authentication state from the supabase client by using a listener.
const authListener = () => {
  const { setCurrentUser } = useCurrentAccountStore.getState();

  supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      setCurrentUser({
        id: session.user.id,
        email: session.user.email,
      });
    } else {
      setCurrentUser(null);
    }
  });
};

// Call this function in your app's entry point (e.g., App.js or index.js)
export default authListener;
