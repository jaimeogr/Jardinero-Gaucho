// src/navigation/HomeStackNavigator.js
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';

// Import your screen components
import HomeScreen from '../screens/HomeScreen';
import LotCreationScreen from '../screens/LotCreationScreen';
import LotManagementScreen from '../screens/LotManagementScreen';

const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator
      style={styles.homeStackNavigator}
      initialRouteName="HomeMain"
    >
      <Stack.Screen
        name="HomeMain"
        component={HomeScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LotManagement"
        component={LotManagementScreen}
        options={{ title: 'Lot Management' }}
      />
      <Stack.Screen
        name="LotCreation"
        component={LotCreationScreen}
        options={{ title: 'Create New Lot' }}
      />
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
