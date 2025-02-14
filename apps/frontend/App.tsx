// App.tsx

import 'react-native-get-random-values';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

// TODO: Replace this imports with @ pattern imports
import AuthNavigator from './src/navigation/AuthNavigator';
import authListener from './src/utils/authListener';
authListener();

if (__DEV__) {
  console.log('The app is running in development mode');
  import('./config/ReactotronConfig').then(() => console.log('Reactotron Configured'));
} else {
  console.log('The app is running in production mode');
}

export default function App() {
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
