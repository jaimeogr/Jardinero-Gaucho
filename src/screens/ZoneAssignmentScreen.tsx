// src/screens/ZoneAssignmentScreen.tsx

import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useSafeAreaFrame } from 'react-native-safe-area-context';

import CustomSelectInput from '../components/CustomSelectInput';
import NestedViewLots from '../components/NestedViewLots/NestedViewLots';
import useControllerService from '../services/useControllerService';
import { theme } from '../styles/styles';
import { UserInterface, UserRole } from '../types/types';

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
  } = useControllerService;

  const { userId, isNewUser } = route.params;

  const [user, setUser] = useState<UserInterface | null>(null);
  const [accessToAllLots, setAccessToAllLots] = useState<
    string | boolean | null
  >(null);

  // Clear selections when the screen is focused
  useEffect(() => {
    deselectAllLots();

    const existingUser = getUserInActiveWorkgroupWithRole(userId);
    if (existingUser) {
      setUser(existingUser);
      setAccessToAllLots(existingUser.accessToAllLots);
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

  // Handler for deselecting lots
  const handleDeselectLots = useCallback(() => {
    deselectAllLots();
  }, [deselectAllLots]);

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
      setAccessToAllLots(value);
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
        <Text style={styles.userEmail}>{user?.email}</Text>
      </View>

      {/* Access to All Lots Zones */}
      <CustomSelectInput
        label="Acceso a zonas"
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
        handleDeselectLots={handleDeselectLots}
        title="seleccionar zonas:"
        onlyZonesAreSelectable={true}
        expandNeighbourhood={true}
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
    padding: 16,
    backgroundColor: 'white',
  },
  userFullName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    fontWeight: 'normal',
  },
  accessToAllZonesPickerContainer: {
    paddingHorizontal: 16,
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
