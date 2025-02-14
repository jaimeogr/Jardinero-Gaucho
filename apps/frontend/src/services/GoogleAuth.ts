// GoogleAuth.ts
import {
  User,
  GoogleSignin,
  statusCodes,
  isSuccessResponse,
  isErrorWithCode,
} from '@react-native-google-signin/google-signin';
import { useState } from 'react';

import supabase from '@/utils/supabase';

// Configure Google Sign-In
GoogleSignin.configure({
  webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID, // you don’t need to manually include a separate GOOGLE_ANDROID_CLIENT_ID in your code when working with Expo managed projects (and not using Firebase). Just ensure your OAuth credentials are properly set up on Google’s side and that your Expo configuration has the correct package/bundle identifiers. Then use your webClientId in your GoogleSignin.configure call, and you’re good to go. theoretically this applies to production environment as well
  scopes: [],
  offlineAccess: true,
  forceCodeForRefreshToken: true, // [Android] related to `serverAuthCode`, read the docs on https://react-native-google-signin.github.io/docs/original.
});

const GoogleAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const signIn = async () => {
    setLoading(true);
    setError(null);

    try {
      await GoogleSignin.hasPlayServices();
      const googleResponse = await GoogleSignin.signIn();
      if (isSuccessResponse(googleResponse)) {
        setUser(googleResponse.data);
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

        // Update the user's first and last name in the "accounts" table if they are missing
        if (supaData && supaData.user) {
          const userId: string = supaData.user.id;
          const firstName: string = googleResponse.data.givenName ?? '';
          const lastName: string = googleResponse.data.familyName ?? '';

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

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  return {
    user,
    loading,
    error,
    signIn,
    signOut,
  };
};

export default GoogleAuth;
