// src/screens/InviteUserScreen.tsx

import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  FlatList,
  Alert,
  StyleSheet,
} from 'react-native';
import { Surface } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';

import ControllerService from '../services/useControllerService';
import { theme } from '../styles/styles';
import { UserRole } from '../types/types';

const roles = [
  {
    role: 'Owner',
    title: 'Socio',
    description: 'Gestión total del equipo.',
  },
  {
    role: 'Manager',
    title: 'Administrador',
    description: 'Asigna tareas y supervisa lotes.',
  },
  {
    role: 'Member',
    title: 'Jardinero',
    description: 'Realiza tareas asignadas.',
  },
];

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
  const [modalVisible, setModalVisible] = useState(false);

  const handleRoleSelect = (role: string) => {
    setSelectedRole(role);
    setModalVisible(false); // Close the modal after selection
  };

  const getDynamicButtonText = () => {
    return accessToAllLots
      ? 'Invitar Integrante'
      : 'Seleccionar Lotes para el Integrante';
  };

  const handleButtonPress = () => {
    if (accessToAllLots) {
      // Proceed with inviting the user
      console.log('Inviting user...');
      if (!email) {
        Alert.alert('Email inválido', 'Por favor ingresá un email válido.');
        return;
      }
      const success = ControllerService.inviteUserToActiveWorkgroup(
        email,
        inviteRole,
        accessToAllLots,
      );
      if (success) {
        Alert.alert('Éxito', 'El integrante ha sido invitado.');
        navigation.goBack();
      }
    } else {
      // Navigate to lot selection screen
      navigation.navigate('LotSelectionScreen');
    }
  };

  return (
    <View style={styles.container}>
      {/* Email Input */}
      <Text style={styles.inputTitle}>Email</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresá el email del integrante"
        placeholderTextColor={theme.colors.placeholder}
        value={email}
        onChangeText={setEmail}
      />

      {/* Role Picker */}
      <Text style={styles.inputTitle}>Rol</Text>
      <TouchableOpacity
        style={styles.picker}
        onPress={() => setModalVisible(true)}
      >
        <Text
          style={[styles.pickerText, selectedRole ? null : styles.placeholder]}
        >
          {selectedRole
            ? roles.find((r) => r.role === selectedRole)?.title
            : 'Seleccionar Rol'}
        </Text>
        <Icon name="chevron-down" size={24} color={theme.colors.primary} />
      </TouchableOpacity>

      {/* Access to All Lots Picker */}
      <Text style={styles.inputTitle}>Acceso a lotes</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={(value) => setAccessToAllLots(value)}
          placeholder={{
            label: 'Seleccioná una opción...',
            value: null,
          }}
          items={[
            { label: 'Todos los lotes', value: true },
            { label: 'Sólo los lotes seleccionados', value: false },
          ]}
          value={accessToAllLots}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
          Icon={() => (
            <Icon
              name="chevron-down"
              size={24}
              color={theme.colors.primary} // Adjust icon color
              style={{ marginRight: 12 }} // Adjust margin if needed
            />
          )}
        />
      </View>

      {/* Dynamic CTA Button - Call to Action */}
      <TouchableOpacity style={styles.button} onPress={handleButtonPress}>
        <Text style={styles.buttonText}>{getDynamicButtonText()}</Text>
      </TouchableOpacity>

      {/* Role Selection Modal */}
      <Modal visible={modalVisible} transparent={true} animationType="slide">
        <View style={styles.modalContainer}>
          <FlatList
            data={roles}
            keyExtractor={(item) => item.role}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.roleCard}
                onPress={() => handleRoleSelect(item.role)}
              >
                <Text style={styles.roleTitle}>{item.title}</Text>
                <Text style={styles.roleDescription}>{item.description}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#f5f5f5',
  },
  inputTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
    fontSize: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 10,
    marginBottom: 16,
  },
  picker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 10,
    padding: 12,
    marginBottom: 16,
  },
  pickerText: {
    fontSize: 16,
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  roleCard: {
    backgroundColor: '#fff',
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 8,
    elevation: 3,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  roleDescription: {
    fontSize: 14,
    marginTop: 8,
    color: 'gray',
  },
  placeholder: {
    color: theme.colors.placeholder,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 10,
    paddingHorizontal: 10,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 10,
    color: 'black',
    paddingRight: 30,
  },
  iconContainer: {
    top: 12, // Adjust the position
  },
});

export default InviteUserScreen;
