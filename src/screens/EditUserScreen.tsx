// src/screens/EditUserScreen.tsx

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  View,
  Text,
  TouchableOpacity,
  Alert,
  StyleSheet,
} from 'react-native';

import CustomSelectInput from '../components/CustomSelectInput';
import ReadOnlyField from '../components/ReadOnlyField'; // Import ReadOnlyField
import RolePicker from '../components/RolePicker';
import useControllerService from '../services/useControllerService';
import { theme } from '../styles/styles';
import { UserRole, UserInActiveWorkgroupWithRole } from '../types/types';

type RootStackParamList = {
  EditUser: { userId: string };
  // other routes...
};

type EditUserScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'EditUser'
>;

type EditUserScreenRouteProp = RouteProp<RootStackParamList, 'EditUser'>;

interface Props {
  navigation: EditUserScreenNavigationProp;
  route: EditUserScreenRouteProp;
}

const EditUserScreen: React.FC<Props> = ({ navigation, route }) => {
  const { userId } = route.params;
  const [user, setUser] = useState<UserInActiveWorkgroupWithRole | null>(null);

  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [accessToAllLots, setAccessToAllLots] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchedUser: UserInActiveWorkgroupWithRole | null =
      useControllerService.getUserInActiveWorkgroupWithRole(userId);
    if (fetchedUser) {
      setUser(fetchedUser);
      setSelectedRole(fetchedUser.role);
      setAccessToAllLots(fetchedUser.accessToAllLots);
    } else {
      Alert.alert('Error', 'Usuario no encontrado.');
      navigation.goBack();
    }
  }, [userId, navigation]);

  const isPickerDisabled =
    selectedRole === 'Owner' || selectedRole === 'Manager';

  const handleRolePick = (role: string) => {
    setSelectedRole(role);
    if (isPickerDisabled) {
      setAccessToAllLots(true);
    }
  };

  const handleButtonPress = () => {
    if (!user) {
      Alert.alert('Error', 'Usuario no encontrado.');
      return;
    }

    if (accessToAllLots === null) {
      Alert.alert(
        'Acceso a zonas debe estar completo',
        'Por favor seleccioná una opción.',
      );
      return;
    }

    // Proceed with updating the user
    console.log('Updating user...');
    const success = useControllerService.updateUserInActiveWorkgroup(
      user.userId,
      selectedRole as UserRole,
      accessToAllLots,
    );
    if (success) {
      if (accessToAllLots) {
        Alert.alert('Éxito', 'El integrante ha sido actualizado.');
        navigation.goBack();
      } else {
        // Navigate to zone assignment screen
        navigation.navigate('ZoneAssignment', { userId: user.userId });
      }
    } else {
      Alert.alert('Error', 'No se pudo actualizar el integrante.');
    }
  };

  const getFullName = () => {
    const firstName = user?.firstName || '';
    const lastName = user?.lastName || '';
    return `${firstName} ${lastName}`.trim(); // Trim to avoid extra spaces
  };

  return (
    <View style={styles.container}>
      {!user ? (
        // if no user, show loading indicator
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <>
          {/* Email Display */}
          <ReadOnlyField
            label="Nombre y Apellido"
            text={getFullName()}
            placeholder="Nombre y apellido no disponible"
          />

          {/* Email Display */}
          <ReadOnlyField
            label="Email"
            text={user.email}
            placeholder="Email no disponible"
          />

          {/* Role Picker */}
          <RolePicker selectedRole={selectedRole} onSelect={handleRolePick} />

          {/* Access to All Lots Picker */}
          <CustomSelectInput
            label="Acceso a zonas"
            // placeholder="Seleccioná una opción"
            value={isPickerDisabled ? true : accessToAllLots}
            isDisabled={isPickerDisabled}
            onValueChange={(value) => {
              if (typeof value === 'boolean') {
                setAccessToAllLots(value);
              } else {
                console.warn('Invalid value type passed:', value);
              }
            }}
            items={[
              {
                label: isPickerDisabled
                  ? 'Todas las zonas'
                  : 'Todas las zonas (Ideal para empezar)',
                value: true,
              },
              {
                label: 'Solo las seleccionadas (Mayor control)',
                value: false,
              },
            ]}
          />

          {/* Dynamic CTA Button - Call to Action */}
          <TouchableOpacity
            style={[
              styles.button,
              accessToAllLots ? null : styles.secondaryButton,
            ]}
            onPress={handleButtonPress}
          >
            <Text
              style={[
                styles.buttonText,
                accessToAllLots ? null : styles.secondaryText,
              ]}
            >
              {accessToAllLots
                ? 'Actualizar Integrante'
                : 'Actualizar Integrante y Seleccionar sus Zonas'}
            </Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  secondaryButton: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  secondaryText: {
    color: theme.colors.primary,
  },
});

export default EditUserScreen;
