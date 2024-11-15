import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { StyleSheet } from 'react-native';

// Import your screen components
import InviteUserScreen from '../screens/InviteUserScreen';
import MyTeamScreen from '../screens/MyTeamScreen';
import ZoneAssignmentScreen from '../screens/ZoneAssignmentScreen';

const Stack = createNativeStackNavigator();

const TeamStackNavigator = () => {
  return (
    <Stack.Navigator
      style={styles.TeamStackNavigator}
      initialRouteName="HomeMain"
    >
      <Stack.Screen
        name="MyTeam"
        component={MyTeamScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="InviteUser"
        component={InviteUserScreen}
        options={{ title: 'Invitar integrante' }}
      />
      <Stack.Screen
        name="ZoneAssignment"
        component={ZoneAssignmentScreen}
        options={{ title: 'Asignar Zonas' }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  TeamStackNavigator: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TeamStackNavigator;
