// src/screens/ZoneAssignmentScreen.tsx

import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';

import CustomSelectInput from '../components/CustomSelectInput';
import NestedViewLots from '../components/NestedViewLots/NestedViewLots';
import useTeamManagementController from '../controllers/useTeamManagementController';
import { theme } from '../styles/styles';
import { UserInterface } from '../types/types';

const SCREEN_CODE_FOR_GLOBAL_STATE = 'zoneAssignmentScreen';

type RootStackParamList = {
  ZoneAssignment: {
    userId?: string;
  };
};

type LotAssignmentScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ZoneAssignment'
  // 'InviteUser' // commenting 'inviteuser' breaks the code?
>;

interface Props {
  navigation: LotAssignmentScreenNavigationProp;
  route: {
    params?: {
      userId?: string;
    };
  };
}

const ZoneAssignmentScreen: React.FC<Props> = ({ navigation, route }) => {
  const {
    deselectAllLots,
    updateZoneAssignmentsAndRoleForUser,
    selectAssignedZonesForUser,
    useUserInActiveWorkgroupWithRole,
    inviteUserToActiveWorkgroup,
    getTemporaryUserData,
    setTemporaryUserData,
    expandAllNeighbourhoods,
  } = useTeamManagementController();

  const userId = route.params?.userId;

  const [user, setUser] = useState<Partial<UserInterface> | null>(null);
  const [accessToAllLots, setAccessToAllLots] = useState<boolean>(false);

  // Existing user case, get the user data when the userId is provided
  const existingUser = useUserInActiveWorkgroupWithRole(userId || '');

  // Get neighbourhoods and zones

  // Get temporary user data
  const { temporaryUserData, temporaryisNewUser } = getTemporaryUserData();

  const clearTemporaryState = useCallback(() => {
    setTemporaryUserData(null, false);
  }, [setTemporaryUserData]);

  useEffect(() => {
    console.log('route.params?.userId');
    console.log(route.params?.userId);
    // Expand the neighbourhood accordions
    expandAllNeighbourhoods();
    // Clear selections
    deselectAllLots();
  }, []);

  useEffect(() => {
    // Initialize the user
    const hasNoTemporaryData = !temporaryisNewUser && !temporaryUserData; // use case 1
    const hasNoUserId = !userId; // use case 2

    if (hasNoTemporaryData && hasNoUserId) {
      Alert.alert('Error', 'No user data provided.');
      navigation.goBack();
      return;
    }

    // Use case 1: New user case. This will run only the first time when the user is still null
    if (temporaryisNewUser && temporaryUserData && user === null) {
      setUser({
        userId: undefined, // Will be set upon creation
        email: temporaryUserData.email,
        firstName: '',
        lastName: '',
        workgroupAssignments: [],
      });
    }

    // Use case 2: Existing user case. This will run only the first time when the user is still null
    if (userId && existingUser && user === null) {
      setUser(existingUser);
      // Pre-select zones assigned to the user when it doesnt have access to all zones
      if (!existingUser.accessToAllLots) {
        selectAssignedZonesForUser(userId);
      }
    }

    // Add `beforeRemove` listener
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      // Detect if navigation is a back action or POP, this last one can happen on gestures that indicate navigating back
      if (e.data.action.type === 'GO_BACK' || e.data.action.type === 'POP') {
        // Do NOT clear temporary data when navigating back
        return;
      }

      // clear the temporary data when the component unmounts
      clearTemporaryState();
    });

    return () => {
      // Cleanup listener when component unmounts
      unsubscribe();
    };
  }, [
    user,
    userId,
    temporaryUserData,
    temporaryisNewUser,
    navigation,
    existingUser,
    useUserInActiveWorkgroupWithRole,
    selectAssignedZonesForUser,
    clearTemporaryState,
  ]);

  const handleAccessToAllLotsChange = (value: string | boolean | null) => {
    if (typeof value === 'boolean') {
      setAccessToAllLots(value);
      if (value === true) {
        // No need to select zones; user has access to all
      } else if (userId) {
        // select zones assigned to the user if there is an existant userId
        selectAssignedZonesForUser(userId);
      } else {
        // since there is no userId, deselect all lots for the new user case
        deselectAllLots();
      }
    } else {
      console.warn('Invalid value type passed:', value);
    }
  };

  // Handler for assigning zones
  const handleAssignZones = () => {
    if (!user) {
      Alert.alert('Error', 'Usuario no válido.');
      return;
    }

    if (temporaryisNewUser && temporaryUserData) {
      // Create the new user now
      const newUser = inviteUserToActiveWorkgroup(temporaryUserData.email, temporaryUserData.role, accessToAllLots);

      if (newUser) {
        if (accessToAllLots) {
          Alert.alert('Éxito', 'El integrante ha sido invitado.');
        } else {
          // Assign zones to the new user using the selection in the store
          updateZoneAssignmentsAndRoleForUser(newUser.userId, accessToAllLots, temporaryUserData.role);
          Alert.alert('Asignación exitosa', 'El integrante ha sido invitado y las zonas han sido asignadas.');
        }
      } else {
        Alert.alert('Error', 'No se pudo crear el usuario.');
      }
    } else if (userId) {
      // Existing user case
      updateZoneAssignmentsAndRoleForUser(userId, accessToAllLots, 'Member');

      Alert.alert('Asignación exitosa', 'Las zonas han sido asignadas.');
    } else {
      Alert.alert('Error', 'Operación inválida.');
    }
    navigation.navigate('MyTeam');
  };

  const capitalizeFirstLetter = (string: string) => {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  };

  const getFullName = () => {
    const firstName = capitalizeFirstLetter(user?.firstName || '');
    const lastName = capitalizeFirstLetter(user?.lastName || '');
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName === '' ? null : fullName; // Return null if fullName is empty
  };

  return (
    <View style={styles.container}>
      {/* Render the user name and email */}
      <View style={styles.userInfoAndPickerContainer}>
        {getFullName() && <Text style={styles.userFullName}>{getFullName()}</Text>}
        <Text style={[styles.userEmail, getFullName() ? null : styles.userEmailIsLarge]}>{user?.email}</Text>

        {/* Access to All Lots Zones */}
        <CustomSelectInput
          // label="Acceso a zonas"
          value={accessToAllLots}
          onValueChange={handleAccessToAllLotsChange}
          customStyle={styles.accessToAllZonesPickerContainer}
          items={[
            {
              label: 'Solo las seleccionadas',
              value: false,
            },
            {
              label: 'Todas las zonas',
              value: true,
            },
          ]}
        />
      </View>

      {/* Conditionally render NestedViewLots based on accessToAllLots */}
      {/* This way, when accessToAllLots is true, the user won't see the list of zones, emphasizing that they have access to all zones. */}
      {!accessToAllLots && (
        <NestedViewLots
          screen={SCREEN_CODE_FOR_GLOBAL_STATE}
          handleDeselectLots={() => null} // since this part of the code is not even rendered, i pass null to avoid turning this prop as optional just to keep it easier to maintain and implement
          onlyZonesAreSelectable={true}
          blockZoneExpansion={true}
          hideLotsCounterAndTitle={true}
        />
      )}

      {/* Button to assign the selected lots */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAssignZones}>
          <Text style={styles.buttonText}>{temporaryisNewUser ? 'Asignar Zonas' : 'Guardar Cambios'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexGrow: 1,
    backgroundColor: 'white',
    justifyContent: 'space-between',
  },
  userInfoAndPickerContainer: {
    paddingHorizontal: 24,
    paddingTop: 16,
    backgroundColor: 'white',
  },
  userFullName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    fontWeight: 'normal',
    color: theme.colors.placeholder,
  },
  userEmailIsLarge: {
    fontSize: 20,
    color: 'black',
  },
  accessToAllZonesPickerContainer: {
    paddingTop: 16,
  },
  buttonContainer: {
    // flexGrow: 1,
    justifyContent: 'flex-end',
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    margin: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ZoneAssignmentScreen;
