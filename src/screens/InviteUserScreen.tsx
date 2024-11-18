// src/screens/InviteUserScreen.tsx

import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet } from 'react-native';

import CustomSelectInput from '../components/CustomSelectInput';
import CustomTextInput from '../components/CustomTextInput';
import RolePicker from '../components/RolePicker';
import ControllerService from '../services/useControllerService';
import { theme } from '../styles/styles';
import { UserRole } from '../types/types';

type RootStackParamList = {
  InviteUser: undefined;
  // other routes...
};

type InviteUserScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'InviteUser'
>;

interface Props {
  navigation: InviteUserScreenNavigationProp;
}

const InviteUserScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [accessToAllLots, setAccessToAllLots] = useState(true);

  const isPickerDisabled =
    selectedRole === 'Owner' || selectedRole === 'Manager';

  const handleRolePick = (role: string) => {
    setSelectedRole(role);
    if (isPickerDisabled) {
      // Owner and Manager roles have access to all lots by default
      setAccessToAllLots(true);
    }
  };

  const handleButtonPress = () => {
    if (!email) {
      Alert.alert('Email inválido', 'Por favor ingresá un email válido.');
      return;
    }
    if (accessToAllLots === null) {
      Alert.alert(
        'Acceso a zonas debe estar completo',
        'Por favor seleccioná una opción.',
      );
      return;
    }

    // Proceed with inviting the user
    console.log('Inviting user...');
    const success = ControllerService.inviteUserToActiveWorkgroup(
      email,
      selectedRole as UserRole,
      accessToAllLots,
    );
    if (accessToAllLots) {
      if (success) {
        Alert.alert('Éxito', 'El integrante ha sido invitado.');
        navigation.goBack();
      }
    } else {
      // Prepare temporary user data
      const newUser = {
        email,
        role: selectedRole,
      };

      // Navigate to zone assignment screen
      navigation.navigate('ZoneAssignment', { newUser });
    }
  };

  return (
    <View style={styles.container}>
      {/* Email Input */}
      <CustomTextInput
        label="Email"
        placeholder="Ingresá el email del integrante"
        value={email}
        onChangeText={setEmail}
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
            setAccessToAllLots(value); // Handle only boolean values
          } else {
            console.warn('Invalid value type passed:', value); // Debugging fallback
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
            ? 'Invitar Integrante'
            : 'Invitar Integrante y Seleccionar sus Zonas'}
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

export default InviteUserScreen;
