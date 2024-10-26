// src/screens/InviteUserScreen.tsx

import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

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
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<UserRole>('Member');
  const [accessToAllLots, setAccessToAllLots] = useState<boolean>(true);

  const handleInviteUser = () => {
    if (!inviteEmail) {
      Alert.alert('Email inválido', 'Por favor ingresá un email válido.');
      return;
    }
    const success = ControllerService.inviteUserToActiveWorkgroup(
      inviteEmail,
      inviteRole,
      accessToAllLots,
    );
    if (success) {
      Alert.alert('Éxito', 'El integrante ha sido invitado.');
      navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invitar Nuevo Integrante</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresá el email del integrante"
        value={inviteEmail}
        onChangeText={setInviteEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.label}>Seleccionar Rol</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setInviteRole(value)}
          items={[
            { label: 'Socio', value: 'Owner' },
            { label: 'Administrador', value: 'Manager' },
            { label: 'Jardinero', value: 'Member' },
          ]}
          value={inviteRole}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
        />
      </View>
      <Text style={styles.label}>Acceso a todos los lotes</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setAccessToAllLots(value)}
          items={[
            { label: 'Sí', value: true },
            { label: 'No', value: false },
          ]}
          value={accessToAllLots}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
        />
      </View>
      <View style={styles.buttonsContainer}>
        <TouchableOpacity
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, styles.submitButton]}
          onPress={handleInviteUser}
        >
          <Text style={styles.submitButtonText}>Invitar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 10,
    padding: 8,
    marginBottom: 20,
    fontSize: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 18,
  },
  buttonsContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  button: {
    flex: 1,
    borderRadius: 50,
    paddingVertical: 12,
    alignItems: 'center',
    marginHorizontal: 8,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: '#aaa',
  },
  cancelButtonText: {
    color: 'gray',
    fontSize: 14,
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'black',
    paddingRight: 30,
  },
  placeholder: {
    color: '#aaa',
  },
  viewContainer: {
    paddingHorizontal: 8,
    paddingVertical: 12,
  },
});
export default InviteUserScreen;
