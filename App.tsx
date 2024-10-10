import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import BottomTabNavigator from './src/navigation/BottonTabNavigator';
import 'mobx-react-lite/batchingForReactNative';

if (__DEV__) {
  console.log('The app is running in development mode');
  import('./config/ReactotronConfig').then(() =>
    console.log('Reactotron Configured'),
  );

  // Configuration for Mobx Dev Tools
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { connectToDevTools } = require('mobx-devtools-core');
  connectToDevTools({
    host: 'localhost',
    port: 8098,
  });
} else {
  console.log('The app is running in production mode');
}

export default function App() {
  return (
    <PaperProvider>
      <SafeAreaProvider>
        <SafeAreaView style={{ flex: 1 }} edges={['top', 'left', 'right']}>
          <NavigationContainer>
            <BottomTabNavigator />
          </NavigationContainer>
        </SafeAreaView>
      </SafeAreaProvider>
    </PaperProvider>
  );
}
