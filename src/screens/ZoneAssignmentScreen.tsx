// src/screens/ZoneAssignmentScreen.tsx

import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';

import CustomSelectInput from '../components/CustomSelectInput';
import NestedViewLots from '../components/NestedViewLots/NestedViewLots';
import useControllerService from '../services/useControllerService';
import { theme } from '../styles/styles';
import { UserInterface, UserRole } from '../types/types';

type RootStackParamList = {
  ZoneAssignment: {
    newUserData?: {
      email: string;
      role: UserRole;
      accessToAllLots: boolean;
    };
    userId?: string;
    isNewUser: boolean;
  };
  InviteUser: {
    email?: string;
    role?: UserRole;
    accessToAllLots?: boolean;
  };
};

type LotAssignmentScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ZoneAssignment'
  // 'InviteUser' // commenting 'inviteuser' breaks the code?
>;

interface Props {
  navigation: LotAssignmentScreenNavigationProp;
  route: RouteProp<RootStackParamList, 'ZoneAssignment'>;
}

const ZoneAssignmentScreen: React.FC<Props> = ({ navigation, route }) => {
  const {
    updateZoneAssignmentsForMember,
    deselectAllLots,
    selectAllZones,
    preselectAssignedZonesInWorkgroupForUser,
    getUserInActiveWorkgroupWithRole,
    useNeighbourhoodsAndZones,
    inviteUserToActiveWorkgroup,
  } = useControllerService;

  const { newUserData, userId, isNewUser } = route.params;

  const [user, setUser] = useState<UserInterface | null>(null);
  const [accessToAllLots, setAccessToAllLots] = useState<boolean>(false);

  // Get neighbourhoods and zones
  const neighbourhoods = useNeighbourhoodsAndZones();

  // useEffect(() => {
  //   if (isNewUser && newUserData) {
  //     navigation.setOptions({
  //       headerLeft: () => (
  //         <TouchableOpacity
  //           onPress={handleIntercept}
  //           style={{ marginRight: 10 }}
  //         >
  //           <Icon name="arrow-left" size={26} color="black" />
  //         </TouchableOpacity>
  //       ),
  //     });
  //   }
  // }, [navigation, isNewUser, newUserData, accessToAllLots]);

  const handleIntercept = () => {
    if (isNewUser && newUserData) {
      // Pass user input back to InviteUserScreen
      navigation.replace('InviteUser', {
        email: newUserData.email,
        role: newUserData.role,
        accessToAllLots,
      });
    } else {
      navigation.goBack();
    }
  };

  // Clear selections when the screen is focused and initialize the user
  useEffect(() => {
    deselectAllLots();

    if (isNewUser && newUserData) {
      // New user case
      setUser({
        userId: '', // Will be set upon creation
        email: newUserData.email,
        firstName: '',
        lastName: '',
        workgroupAssignments: [],
      });
      setAccessToAllLots(newUserData.accessToAllLots);
    } else if (userId) {
      // Existing user case
      const existingUser = getUserInActiveWorkgroupWithRole(userId);
      if (existingUser) {
        setUser(existingUser);
        setAccessToAllLots(existingUser.accessToAllLots);
        // Pre-select zones assigned to the user when it doesnt have access to all zones
        if (!existingUser.accessToAllLots) {
          preselectAssignedZonesInWorkgroupForUser(userId);
        }
      } else {
        Alert.alert('Error', 'Usuario no encontrado.');
        navigation.goBack();
      }
    } else {
      Alert.alert('Error', 'Datos inválidos.');
      navigation.goBack();
    }
  }, [
    navigation,
    deselectAllLots,
    userId,
    isNewUser,
    newUserData,
    selectAllZones,
    getUserInActiveWorkgroupWithRole,
    preselectAssignedZonesInWorkgroupForUser,
  ]);

  // Compute totalZones and selectedZones
  const { totalZones, selectedZones } = React.useMemo(() => {
    let total = 0;
    let selected = 0;

    neighbourhoods.forEach((neighbourhood) => {
      neighbourhood.zones.forEach((zone) => {
        total += 1;
        if (zone.isSelected) {
          selected += 1;
        }
      });
    });

    return { totalZones: total, selectedZones: selected };
  }, [neighbourhoods]);

  const handleAccessToAllLotsChange = (value: string | boolean | null) => {
    if (typeof value === 'boolean') {
      setAccessToAllLots(value);
      if (value === true) {
        // No need to select zones; user has access to all
      } else {
        // select zones assigned to the user
        preselectAssignedZonesInWorkgroupForUser(userId);
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

    if (isNewUser && newUserData) {
      // Create the new user now
      const newUser = inviteUserToActiveWorkgroup(
        newUserData.email,
        newUserData.selectedRole,
        accessToAllLots,
      );

      if (newUser) {
        if (accessToAllLots) {
          Alert.alert('Éxito', 'El integrante ha sido invitado.');
        } else {
          // Assign zones to the new user using the selection in the store
          updateZoneAssignmentsForMember(newUser.userId, accessToAllLots);
          Alert.alert(
            'Asignación exitosa',
            'El integrante ha sido invitado y las zonas han sido asignadas.',
          );
        }
      } else {
        Alert.alert('Error', 'No se pudo crear el usuario.');
      }
    } else if (userId) {
      // Existing user case
      updateZoneAssignmentsForMember(user.userId, accessToAllLots);

      Alert.alert('Asignación exitosa', 'Las zonas han sido asignadas.');
    } else {
      Alert.alert('Error', 'Operación inválida.');
    }
    navigation.navigate('MyTeam');
  };

  const getFullName = () => {
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName === '' ? null : fullName; // Return null if fullName is empty
  };

  return (
    <View style={styles.container}>
      {/* Render the user name and email */}
      <View style={styles.userInfoAndPickerContainer}>
        {getFullName() && (
          <Text style={styles.userFullName}>{getFullName()}</Text>
        )}
        <Text
          style={[
            styles.userEmail,
            getFullName() ? null : styles.userEmailIsLarge,
          ]}
        >
          {user?.email}
        </Text>

        {/* Access to All Lots Zones */}
        <CustomSelectInput
          // label="Acceso a zonas"
          value={accessToAllLots}
          onValueChange={handleAccessToAllLotsChange}
          customStyle={styles.accessToAllZonesPickerContainer}
          items={[
            {
              label: 'Solo las seleccionadas (Mayor control)',
              value: false,
            },
            {
              label: 'Todas las zonas (Más simple)',
              value: true,
            },
          ]}
        />
      </View>

      {/* Conditionally render NestedViewLots based on accessToAllLots */}
      {/* This way, when accessToAllLots is true, the user won't see the list of zones, emphasizing that they have access to all zones. */}
      {!accessToAllLots && (
        <NestedViewLots
          handleDeselectLots={() => null} // since this part of the code is not even rendered, i pass null to avoid turning this prop as optional just to keep it easier to maintain and implement
          onlyZonesAreSelectable={true}
          expandNeighbourhood={true}
          hideLotsCounterAndTitle={true}
        />
      )}

      {/* Button to assign the selected lots */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button} onPress={handleAssignZones}>
          <Text style={styles.buttonText}>
            {isNewUser ? 'Asignar Zonas' : 'Guardar Cambios'}
          </Text>
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
