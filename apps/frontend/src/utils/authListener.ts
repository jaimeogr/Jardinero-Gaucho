// authListener.ts
import useCurrentAccountStore from '@/stores/useCurrentAccountStore';
import { UserInterface } from '@/types/types';
import supabase from '@/utils/supabase';

// This functions keeps the currentUser state in sync with the user's authentication state from the supabase client by using a listener.
const authListener = () => {
  const { setCurrentUser } = useCurrentAccountStore.getState();

  supabase.auth.onAuthStateChange((event, session) => {
    if (session?.user) {
      (async () => {
        // Retrieve the complete account record from the "accounts" table using session.user.id
        const { data: account, error } = await supabase
          .from<UserInterface, UserInterface>('accounts')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (error) {
          console.error('Error retrieving account data:', error);
          // Optionally, you could fall back to the session.user object if the account record is not found
          // TODO: Or even better, fall back to an AsynStorage object of the user's data
        } else {
          setCurrentUser(account);
        }
      })();
    } else {
      setCurrentUser(null);
    }
  });
};

// Call this function in your app's entry point (e.g., App.js or index.js)
export default authListener;
