// src/navigation/BottomTabNavigator.js
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React from 'react';
import { TouchableRipple } from 'react-native-paper';

// Import your screen components or stack navigators
import HomeStackNavigator from './HomeStackNavigator';
import MoneyManagementScreen from '../screens/MoneyManagementScreen';
import MyTeamScreen from '../screens/MyTeamScreen';
import SettingsScreen from '../screens/SettingsScreen';
import { theme } from '../styles/styles';

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

          return (
            <MaterialCommunityIcons
              name={iconName}
              color={focused ? theme.colors.accent : theme.colors.gray} // Use focused prop to set color explicitly
              size={size}
            />
          );
        },
        tabBarLabelStyle: {
          fontWeight: 'bold', // Make the font bold
          fontSize: 12, // Adjust the font size if needed
        },
        tabBarActiveTintColor: theme.colors.accent,
        tabBarInactiveTintColor: theme.colors.gray,
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
