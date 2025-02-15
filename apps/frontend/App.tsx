// App.tsx

import 'react-native-get-random-values';
import { NavigationContainer } from '@react-navigation/native';
import * as SplashScreen from 'expo-splash-screen';
import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// TODO: Replace this imports with @ pattern imports
import AuthNavigator from './src/navigation/AuthNavigator';
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
  const authLoaded = useCurrentAccountStore((state) => state.authLoaded);

  useEffect(() => {
    if (authLoaded) {
      SplashScreen.hideAsync();
    }
  }, [authLoaded]);

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
          <NavigationContainer>
            <AuthNavigator />
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
