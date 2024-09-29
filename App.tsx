import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

import BottomTabNavigator from './src/navigation/BottonTabNavigator';
import HomeScreen from './src/screens/HomeScreen';

export default function App() {
  return (
    <PaperProvider>
      {/* <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!Hola Vaquero</Text>
        <HomeScreen />
        <StatusBar style="auto" />
      </View> */}
      <BottomTabNavigator />
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
