import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Provider as PaperProvider } from 'react-native-paper';

import LotesScreen from './src/screens/LotesScreen';

export default function App() {
  return (
    <PaperProvider>
      <View style={styles.container}>
        <Text>Open up App.tsx to start working on your app!Hola Vaquero</Text>
        <LotesScreen />
        <StatusBar style="auto" />
      </View>
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
