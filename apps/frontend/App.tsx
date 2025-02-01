// App.tsx

import 'react-native-get-random-values';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// TODO: Replace this imports with @ pattern imports
import useHomeScreenController from './src/controllers/useHomeScreenController';
import BottomTabNavigator from './src/navigation/BottonTabNavigator';
import SignInScreen from './src/screens/SignInScreen';

if (__DEV__) {
  console.log('The app is running in development mode');
  import('./config/ReactotronConfig').then(() => console.log('Reactotron Configured'));
} else {
  console.log('The app is running in production mode');
}

export default function App() {
  const { initializeServices } = useHomeScreenController();

  useEffect(() => {
    initializeServices();
  }, []);

  return (
    <PaperProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
          <SignInScreen />
          {/*           
          this will be commented for now just to be able to work on the sign in screen
          <NavigationContainer>
            <BottomTabNavigator />
          </NavigationContainer> */}
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
