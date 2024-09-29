// src/navigation/BottomTabNavigator.js
import React, { useState } from 'react';
import { BottomNavigation } from 'react-native-paper';

// Import your screen components
import HomeScreen from '../screens/HomeScreen';
import MoneyManagementScreen from '../screens/MoneyManagementScreen';
import MyTeamScreen from '../screens/MyTeamScreen';
import SettingsScreen from '../screens/SettingsScreen';

// Define the main BottomTabNavigator component
const BottomTabNavigator = () => {
  // State to manage the currently active tab
  const [index, setIndex] = useState(0);

  // Define the routes (tabs) for your BottomNavigation
  const [routes] = useState([
    { key: 'lotes', title: 'Lotes', focusedIcon: 'home' },
    { key: 'plata', title: 'Plata', focusedIcon: 'currency-usd' },
    { key: 'myteam', title: 'My Team', focusedIcon: 'account-group' },
    { key: 'settings', title: 'Settings', focusedIcon: 'cog' },
  ]);

  // Define the scenes for each tab, linking them to their respective components
  const renderScene = BottomNavigation.SceneMap({
    lotes: HomeScreen,
    plata: MoneyManagementScreen,
    myteam: MyTeamScreen,
    settings: SettingsScreen,
  });

  return (
    <BottomNavigation
      navigationState={{ index, routes }}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default BottomTabNavigator;
