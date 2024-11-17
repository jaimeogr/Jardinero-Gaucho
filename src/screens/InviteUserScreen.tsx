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
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Badge } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';

import RolePicker from '../components/RolePicker';
import ControllerService from '../services/useControllerService';
import { theme } from '../styles/styles';
import { UserRole } from '../types/types';

const RoleDescriptionForRoleCard: React.FC<{ items: string[] }> = ({
  items,
}) => (
  <View>
    {items.map((item, index) => (
      <View key={index} style={styles.bulletItem}>
        <Text style={styles.bullet}>•</Text>
        <Text style={styles.bulletText}>{item}</Text>
      </View>
    ))}
  </View>
);

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

  const isPickerDisabled =
    selectedRole === 'Owner' || selectedRole === 'Manager';

  const handleRolePick = (role: string) => {
    setSelectedRole(role);
    if (isPickerDisabled) {
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

  // Helper function to get descriptions based on role
  const getRoleDescriptionArray = (role: string): string[] => {
    switch (role) {
      case 'Owner':
        return [
          'Acceso completo a la plataforma y a la información de pagos.',
          'Control sobre el equipo (excepto sobre el socio principal).',
        ];
      case 'Manager':
        return [
          'Gestión y supervisión de lotes.',
          'Capacidad para invitar a nuevos administradores y jardineros.',
          'Sin otros derechos.',
        ];
      case 'Member':
        return [
          'Registra tareas realizadas en las zonas asignados.',
          'Sin accesos adicionales.',
        ];
      default:
        return ['Descripción no disponible.'];
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
      <RolePicker selectedRole={selectedRole} onSelect={handleRolePick} />

      {/* Access to All Lots Picker */}
      <Text style={styles.inputTitle}>Acceso a zonas</Text>
      <View
        style={[
          styles.pickerContainer,
          isPickerDisabled ? styles.pickerContainerDisabled : null,
        ]}
      >
        <RNPickerSelect
          onValueChange={(value) => setAccessToAllLots(value)}
          placeholder={{
            label: 'Seleccioná una opción...',
            value: null,
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
          value={accessToAllLots}
          style={{
            ...pickerSelectStyles,
            inputIOS: {
              ...pickerSelectStyles.inputIOS,
              opacity: isPickerDisabled ? 0.5 : 1, // Apply opacity directly based on disabled state
            },
            inputAndroid: {
              ...pickerSelectStyles.inputAndroid,
              opacity: isPickerDisabled ? 0.5 : 1, // Apply opacity directly based on disabled state
            },
          }}
          useNativeAndroidPickerStyle={false}
          Icon={() => (
            <Icon
              name="chevron-down"
              size={24}
              color={
                isPickerDisabled
                  ? theme.colors.disabledText
                  : theme.colors.primary
              } // Adjust icon color
              style={{ marginRight: 12 }} // Adjust margin if needed
            />
          )}
          disabled={isPickerDisabled}
        />
      </View>

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

      {/* Role Selection Modal */}

      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <TouchableWithoutFeedback
          onPress={() => setModalVisible(false)} // Close the modal on outside press
        >
          <View style={styles.centeredOverlay}>
            <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
              <View style={styles.centeredModal}>
                <Text style={styles.rolesModalTitle}>Seleccionar el Rol</Text>
                <FlatList
                  data={roles}
                  keyExtractor={(item) => item.role}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={[
                        styles.roleCard,
                        {
                          borderColor:
                            theme.colors.roles[item.role] || '#1976D2',
                        },
                      ]}
                      onPress={() => handleRolePick(item.role)}
                    >
                      <Badge
                        style={[
                          styles.roleBadge,
                          {
                            backgroundColor:
                              theme.colors.roles[item.role] || '#1976D2',
                          },
                        ]}
                        size={24}
                      >
                        {item.title}
                      </Badge>
                      <RoleDescriptionForRoleCard
                        items={getRoleDescriptionArray(item.role)}
                      />
                    </TouchableOpacity>
                  )}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  inputTitle: {
    fontSize: 18,
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
  pickerContainerDisabled: {
    borderColor: theme.colors.disabled,
    backgroundColor: theme.colors.disabled,
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
  secondaryButton: {
    backgroundColor: 'transparent',
    borderColor: theme.colors.primary,
    borderWidth: 2,
  },
  secondaryText: {
    color: theme.colors.primary,
  },
  centeredOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)', // Transparent black background
    justifyContent: 'center', // Center the content
    alignItems: 'center', // Align horizontally
  },
  centeredModal: {
    width: '80%', // Width of the modal
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderRadius: 10,
    elevation: 5, // Shadow effect for Android
  },
  rolesModalTitle: {
    paddingLeft: 16,
    marginBottom: 10,
    fontSize: 18,
    fontWeight: 'bold',
  },
  roleCard: {
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: 'lightgray',
    // paddingHorizontal: 16,
    paddingVertical: 8,
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 1,
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 6,
    marginBottom: 6,
  },
  roleDescription: {
    fontSize: 14,
    marginTop: 8,
    color: 'gray',
  },
  bulletItem: {
    flexDirection: 'row', // Align bullet and text side by side
    alignItems: 'flex-start', // Align text with top of bullet
    marginBottom: 6, // Space between items
    marginHorizontal: 12, // Space from left and right
  },
  bullet: {
    fontSize: 22, // Slightly larger bullet size
    lineHeight: 16, // Align bullet with text vertically
    marginRight: 6, // Space between bullet and text
    marginTop: 4, // Adjust vertical alignment
    color: '#16423C',
  },
  bulletText: {
    flex: 1, // Allow text to take the remaining space
    fontSize: 16,
    lineHeight: 16, // Ensure proper spacing between lines
    color: '#16423C',
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
