// src/navigation/HomeStackNavigator.js
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';

// Import your screen components
import HomeScreen from '@/screens/HomeScreen';
import LotCreationScreen from '@/screens/LotCreationScreen';
import WorkgroupCreationScreen from '@/screens/WorkgroupCreationScreen';

const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator style={styles.homeStackNavigator} initialRouteName="WorkgroupCreation">
      <Stack.Screen name="WorkgroupCreation" component={WorkgroupCreationScreen} options={{ headerShown: false }} />
      <Stack.Screen name="HomeMain" component={HomeScreen} options={{ headerShown: false }} />
      <Stack.Screen name="LotCreation" component={LotCreationScreen} options={{ title: 'Crear nuevo lote' }} />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  homeStackNavigator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default HomeStackNavigator;
