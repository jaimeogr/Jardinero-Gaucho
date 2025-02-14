import {
  User,
  GoogleSignin,
  statusCodes,
  isSuccessResponse,
  isErrorWithCode,
  isCancelledResponse,
  isNoSavedCredentialFoundResponse,
} from '@react-native-google-signin/google-signin';
import { useEffect, useState } from 'react';

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

  const setCurrentUser = async () => {
    try {
      const currentUser = await GoogleSignin.getCurrentUser();
      if (currentUser) {
        setUser(currentUser);
      }
    } catch (error) {
      console.error('Check user error:', error);
    }
  };

  const signIn = async () => {
    setLoading(true);
    setError(null);

    try {
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (isSuccessResponse(response)) {
        setUser(response.data);
        console.log(JSON.stringify(response.data, null, 2));
        const { data, error } = await supabase.auth.signInWithIdToken({
          provider: 'google',
          token: response.data.idToken,
        });
        console.log(error, data);
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
