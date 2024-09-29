import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';

import BottomTabNavigator from './src/navigation/BottonTabNavigator';

export default function App() {
  return (
    <PaperProvider>
      <StatusBar style="auto" />
      <BottomTabNavigator />
    </PaperProvider>
  );
}
