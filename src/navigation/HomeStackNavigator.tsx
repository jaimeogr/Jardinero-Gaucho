// src/navigation/HomeStackNavigator.js
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';

// Import your screen components
import HomeScreen from '../screens/HomeScreen';
import LotManagementScreen from '../screens/LotManagementScreen';

const Stack = createNativeStackNavigator();

const HomeStackNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="HomeMain">
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
    </Stack.Navigator>
  );
};

export default HomeStackNavigator;
