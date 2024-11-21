// src/screens/ZoneAssignmentScreen.tsx

import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';

import CustomSelectInput from '../components/CustomSelectInput';
import NestedViewLots from '../components/NestedViewLots/NestedViewLots';
import useControllerService from '../services/useControllerService';
import { theme } from '../styles/styles';
import { UserInterface } from '../types/types';

type RootStackParamList = {
  ZoneAssignment: undefined;
  // Other routes...
};

type LotAssignmentScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ZoneAssignment'
>;

interface Props {
  navigation: LotAssignmentScreenNavigationProp;
  route: any;
}

const ZoneAssignmentScreen: React.FC<Props> = ({ navigation, route }) => {
  const {
    updateZoneAssignmentsForMember,
    deselectAllLots,
    selectAllZones,
    preselectAssignedZonesInWorkgroupForUser,
    getUserInActiveWorkgroupWithRole,
    useNeighbourhoodsAndZones,
  } = useControllerService;

  const { userId, isNewUser } = route.params;

  const [user, setUser] = useState<UserInterface | null>(null);

  // Get neighbourhoods and zones
  const neighbourhoods = useNeighbourhoodsAndZones();

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

  // This value is dynamically calculated every time totalZones or selectedZones changes because accessToAllLots is being recalculated during each re-render of the component.
  // React ensures that the component is re-rendered whenever the dependencies of the useMemo or useState hooks change,
  // so the accessToAllLots variable will always reflect the latest values of totalZones and selectedZones.
  const accessToAllLots = totalZones > 0 && totalZones === selectedZones;

  // Clear selections when the screen is focused
  useEffect(() => {
    deselectAllLots();
    const existingUser = getUserInActiveWorkgroupWithRole(userId);
    if (existingUser) {
      setUser(existingUser);
      // Pre-select zones assigned to the user
      preselectAssignedZonesInWorkgroupForUser(userId);
    } else {
      Alert.alert('Error', 'Usuario no encontrado.');
      navigation.goBack();
    }
  }, [
    navigation,
    deselectAllLots,
    userId,
    getUserInActiveWorkgroupWithRole,
    preselectAssignedZonesInWorkgroupForUser,
  ]);

  // Handler for assigning zones
  const handleAssignZones = () => {
    if (!user) {
      Alert.alert('Error', 'Usuario no válido.');
      return;
    }
    updateZoneAssignmentsForMember(user.userId);
    deselectAllLots();
    Alert.alert('Asignación exitosa', 'Las zonas han sido asignadas.');
    navigation.navigate('MyTeam');
  };

  const getFullName = () => {
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';
    const fullName = `${firstName} ${lastName}`.trim();
    return fullName === '' ? null : fullName; // Return null if fullName is empty
  };

  const handleAccessToAllLotsChange = (value: string | boolean | null) => {
    if (typeof value === 'boolean') {
      if (value === true) {
        selectAllZones();
      } else {
        deselectAllLots();
      }
    } else {
      console.warn('Invalid value type passed:', value);
    }
  };

  return (
    <View style={styles.container}>
      {/* Render the user name and email */}
      <View style={styles.userInfoContainer}>
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
      </View>

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

      {/* Render the nested lots */}
      <NestedViewLots
        handleDeselectLots={() => null} // since this part of the code is not even rendered, i pass null to avoid turning this prop as optional just to keep it easier to maintain and implement
        onlyZonesAreSelectable={true}
        expandNeighbourhood={true}
        hideLotsCounterAndTitle={true}
      />

      {/* Button to assign the selected lots */}
      <TouchableOpacity style={styles.button} onPress={handleAssignZones}>
        <Text style={styles.buttonText}>
          {isNewUser ? 'Asignar Zonas' : 'Guardar Cambios'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  userInfoContainer: {
    paddingHorizontal: 24,
    paddingVertical: 16,
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
    paddingHorizontal: 24,
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
