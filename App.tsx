import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import BottomTabNavigator from './src/navigation/BottonTabNavigator';

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
