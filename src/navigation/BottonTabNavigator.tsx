// src/navigation/BottomTabNavigator.js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { IconButton } from 'react-native-paper';

// Import your screen components or stack navigators
import HomeStackNavigator from './HomeStackNavigator';
import MoneyManagementScreen from '../screens/MoneyManagementScreen';
import MyTeamScreen from '../screens/MyTeamScreen';
import SettingsScreen from '../screens/SettingsScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false, // Hide header if not needed
        tabBarIcon: ({ color, size }) => {
          let iconName: string = '';

          if (route.name === 'Lotes') {
            iconName = 'home';
          } else if (route.name === 'Plata') {
            iconName = 'currency-usd';
          } else if (route.name === 'Mi Equipo') {
            iconName = 'account-group';
          } else if (route.name === 'Configuración') {
            iconName = 'cog';
          }

          return (
            <IconButton
              icon={iconName}
              color={color}
              size={size}
              style={{ margin: 0 }}
            />
          );
        },
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: { paddingBottom: 5, height: 60 },
      })}
    >
      <Tab.Screen name="Lotes" component={HomeStackNavigator} />
      <Tab.Screen name="Plata" component={MoneyManagementScreen} />
      <Tab.Screen name="Mi Equipo" component={MyTeamScreen} />
      <Tab.Screen name="Configuración" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
