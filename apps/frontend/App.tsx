// App.tsx

import 'react-native-get-random-values';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { Linking } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// TODO: Replace this imports with @ pattern imports
import AuthNavigator from './src/navigation/AuthNavigator';
import linking from './src/navigation/linking';
import useCurrentAccountStore from './src/stores/useCurrentAccountStore';
import authListener from './src/utils/authListener';

SplashScreen.preventAutoHideAsync();
authListener();

if (__DEV__) {
  console.log('The app is running in development mode');
  import('./config/ReactotronConfig').then(() => console.log('Reactotron Configured'));
} else {
  console.log('The app is running in production mode');
}

export default function App() {
  // authLoaded will be true even after checking the auth state, so we can hide the splash screen
  // when the auth state is loaded.
  // So after the asyncStorage detects no user, the authLoaded will be true and the splash screen will be hidden.
  // Be careful.
  const authLoaded = useCurrentAccountStore((state) => state.authLoaded);

  useEffect(() => {
    if (authLoaded) {
      SplashScreen.hideAsync();
    }
  }, [authLoaded]);

  useEffect(() => {
    // Listen for incoming links while the app is running or coming from background
    const handleUrl = (event: { url: string }) => {
      console.log('Received deep link:', event.url);
      // this is where you handle the incoming links if necessary,
      // but for now the even listener is just helping manage deferred and background states
    };

    const subscription = Linking.addEventListener('url', handleUrl);

    // Cleanup event listener on unmount, mostly for development environments but it wont hurt
    return () => subscription.remove();
  }, []);

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
          <NavigationContainer linking={linking}>
            <AuthNavigator />
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
