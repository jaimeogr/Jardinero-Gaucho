// authService.ts
import {
  GoogleSignin,
  statusCodes,
  isSuccessResponse,
  isErrorWithCode,
} from '@react-native-google-signin/google-signin';
import { useState } from 'react';

import { refreshCurrentAccount } from '@/services/accountService';
import supabase from '@/utils/supabase';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, // you don’t need to manually include a separate GOOGLE_ANDROID_CLIENT_ID in your code when working with Expo managed projects (and not using Firebase). Just ensure your OAuth credentials are properly set up on Google’s side and that your Expo configuration has the correct package/bundle identifiers. Then use your webClientId in your GoogleSignin.configure call, and you’re good to go. theoretically this applies to production environment as well
  scopes: [],
  offlineAccess: true,
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs on https://react-native-google-signin.github.io/docs/original.
});

const AuthService = () => {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    setError(null);
    setLoading(true);

    try {
      await GoogleSignin.hasPlayServices();
      const googleResponse = await GoogleSignin.signIn();
      if (isSuccessResponse(googleResponse)) {
        console.log(JSON.stringify(googleResponse.data, null, 2));

        // Sign in with Supabase using the Google ID token
        const { data: supaData, error: supaError } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: googleResponse.data.idToken,
        });
        if (supaError) {
          console.error('Supabase sign-in error:', error);
          return;
        }
        console.log(JSON.stringify(supaData, null, 2));

        // Update the user's first and last name in the "accounts" table if they are missing
        if (supaData && supaData.user) {
          const userId: string = supaData.user.id;
          const firstName: string = googleResponse.data.user.givenName ?? '';
          const lastName: string = googleResponse.data.user.familyName ?? '';

          // First, try to fetch the existing account record from the "accounts" table.
          const { data: accountRecord, error: selectError } = await supabase
            .from('accounts')
            .select('first_name, last_name')
            .eq('id', userId)
            .single();

          if (selectError) {
            console.error('Error selecting account record:', selectError);
            return;
          }

          if (!accountRecord) {
            console.error(
              'Account record not found, but should have been found since it should be automatically created after google sign in',
            );
          }

          const shouldUpdate =
            !accountRecord.first_name ||
            accountRecord.first_name.trim() === '' ||
            !accountRecord.last_name ||
            accountRecord.last_name.trim() === '';

          if (shouldUpdate) {
            const updatePayload = {
              first_name:
                accountRecord.first_name && accountRecord.first_name.trim() !== ''
                  ? accountRecord.first_name
                  : firstName,
              last_name:
                accountRecord.last_name && accountRecord.last_name.trim() !== '' ? accountRecord.last_name : lastName,
            };

            const { error: updateError } = await supabase.from('accounts').update(updatePayload).eq('id', userId);
            if (updateError) {
              console.error('Error updating account record:', updateError);
            } else {
              console.log('On Updating after first sign in.');
              refreshCurrentAccount(userId);
            }
          }
        }
      } else {
        // sign in was cancelled by user
        console.warn('Sign in was cancelled by user');
      }
    } catch (error) {
      if (isErrorWithCode(error)) {
        switch (error.code) {
          case statusCodes.IN_PROGRESS:
            console.log('Sign in in progress');
            break;
          case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
            console.log('Play services not available or outdated');
            break;
          default:
            console.error('Sign-in error:', error);
        }
      } else {
        // an error that's not related to google sign in occurred
        console.error('An error occurred:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmailPassword = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        console.error('Supabase email+password sign-in error:', error);
        setError('Un error ocurrió durante el inicio de sesión. Por favor, inténtalo de nuevo.');
        return;
      }

      if (data?.user) {
        // Refresh the account record from your "accounts" table
        await refreshCurrentAccount(data.user.id);
      }
    } catch (err) {
      console.error('Error signing in with email/password:', err);
      setError('Un error ocurrió durante el inicio de sesión. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmailPassword = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      // By default, if "Enable email confirmations" is on in Supabase Auth settings,
      // the user must verify their email before the session is valid.
      // If confirmations are off, the user will be signed in immediately.
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        console.error('Supabase email+password sign-up error:', error);
        setError('Un error ocurrió durante el registro. Por favor, inténtalo de nuevo.');
        return;
      }

      // If confirmations are disabled, data.user / data.session will be present immediately
      if (data?.user) {
        console.log('User created with ID:', data.user.id);
        // Optionally refresh the account record
        await refreshCurrentAccount(data.user.id);
      } else {
        // If email confirmations are on, you might not have data.user here.
        console.log('Sign-up successful, check your email for a confirmation link if its required.');
      }
    } catch (err) {
      console.error('Error signing up with email/password:', err);
      setError('Un error ocurrió durante el registro. Por favor, inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Revoke Google token + sign out from Google
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();

      // Then sign out from Supabase
      const { error } = await supabase.auth.signOut();

      /*
        It is not necessary to run the following line of code:
        useCurrentAccountStore.getState().setCurrentUser(null);

        The reason it is not necessary is because authListener.ts
        will run that and set the current user to null automatically when
        the supabase session value changes.
      */

      if (error) {
        // Handle error or log
        console.error(error);
      }
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return {
    error,
    loading,
    signInWithGoogle,
    signInWithEmailPassword,
    signUpWithEmailPassword,
    signOut,
  };
};

export default AuthService;
