import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

import BottomTabNavigator from './src/navigation/BottonTabNavigator';

export default function App() {
  return (
    <PaperProvider>
      <NavigationContainer>
        <BottomTabNavigator />
      </NavigationContainer>
    </PaperProvider>
  );
}
