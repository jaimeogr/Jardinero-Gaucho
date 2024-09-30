// src/navigation/BottomTabNavigator.js
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { IconButton, TouchableRipple } from 'react-native-paper';

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
        tabBarIcon: ({ focused, size }) => {
          let iconName = '';

          if (route.name === 'Lotes') {
            iconName = 'home';
          } else if (route.name === 'Plata') {
            iconName = 'currency-usd';
          } else if (route.name === 'Mi Equipo') {
            iconName = 'account-group';
          } else if (route.name === 'Configuración') {
            iconName = 'cog';
          }

          const iconColor = focused ? '#347928' : 'gray';

          return (
            <IconButton
              icon={iconName}
              color={iconColor}
              size={size}
              style={{ margin: 0 }}
            />
          );
        },
        tabBarLabelStyle: {
          fontWeight: 'bold', // Make the font bold
          fontSize: 12, // Adjust the font size if needed
        },
        tabBarActiveTintColor: '#347928',
        tabBarInactiveTintColor: 'gray',
        tabBarStyle: {
          paddingBottom: 5,
          height: 60,
        },
        tabBarButton: (props) => (
          <TouchableRipple
            {...props}
            rippleColor="rgba(0, 0, 0, .32)" // Customize the ripple effect color
            borderless={true}
          />
        ),
        tabBarPressColor: 'rgba(0, 0, 0, 0.2)', // Change ripple effect color (Android)
        tabBarPressOpacity: 0.5, // Change ripple effect opacity (iOS)
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
