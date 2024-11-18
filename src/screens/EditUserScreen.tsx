// src/screens/EditUserScreen.tsx

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';

import CustomSelectInput from '../components/CustomSelectInput';
import ReadOnlyField from '../components/ReadOnlyField'; // Import ReadOnlyField
import RolePicker from '../components/RolePicker';
import ControllerService from '../services/useControllerService';
import { theme } from '../styles/styles';
import { User, UserRole } from '../types/types';

type RootStackParamList = {
  EditUser: { user: User };
  ZoneAssignment: { user: User };
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
  const { user } = route.params;

  const [selectedRole, setSelectedRole] = useState<string | null>(user.role);
  const [accessToAllLots, setAccessToAllLots] = useState<boolean>(
    user.accessToAllLots,
  );

  const isPickerDisabled =
    selectedRole === 'Owner' || selectedRole === 'Manager';

  const handleRolePick = (role: string) => {
    setSelectedRole(role);
    if (role === 'Owner' || role === 'Manager') {
      setAccessToAllLots(true);
    }
  };

  const handleButtonPress = () => {
    if (accessToAllLots === null) {
      Alert.alert(
        'Acceso a zonas debe estar completo',
        'Por favor seleccioná una opción.',
      );
      return;
    }

    // Proceed with updating the user
    console.log('Updating user...');
    const success = ControllerService.updateUser(
      user.id,
      user.email, // Email remains unchanged
      selectedRole as UserRole,
      accessToAllLots,
    );
    if (accessToAllLots) {
      if (success) {
        Alert.alert('Éxito', 'El integrante ha sido actualizado.');
        navigation.goBack();
      } else {
        Alert.alert('Error', 'No se pudo actualizar el integrante.');
      }
    } else {
      // Navigate to zone assignment screen
      navigation.navigate('ZoneAssignment', { user });
    }
  };

  return (
    <View style={styles.container}>
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
        placeholder="Seleccioná una opción"
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
        style={[styles.button, accessToAllLots ? null : styles.secondaryButton]}
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
