import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import React, { useState } from 'react';
import {
  View,
  Text,
  Modal,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Badge } from 'react-native-paper';

import { theme } from '../styles/styles';

const RoleDescriptionForRoleCard: React.FC<{ items: string[] }> = ({ items }) => (
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

interface RolePickerProps {
  selectedRole: string | null;
  onSelect: (role: string) => void;
}

const RolePicker: React.FC<RolePickerProps> = ({ selectedRole, onSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handleRoleSelect = (role: string) => {
    onSelect(role);
    setModalVisible(false);
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
        return ['Registra tareas realizadas en las zonas asignados.', 'Sin accesos adicionales.'];
      default:
        return ['Descripción no disponible.'];
    }
  };

  return (
    <View>
      <Text style={styles.inputTitle}>Rol</Text>
      <TouchableOpacity style={styles.picker} onPress={() => setModalVisible(true)}>
        <Text style={[styles.pickerText, selectedRole ? null : styles.placeholder]}>
          {/* The selected role is displayed, or the placeholder */}
          {selectedRole ? roles.find((r) => r.role === selectedRole)?.title : 'Seleccionar Rol'}
        </Text>
        <Icon name="chevron-down" size={26} color={theme.colors.primary} />
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
                          borderColor: theme.colors.roles[item.role] || '#1976D2',
                        },
                      ]}
                      onPress={() => handleRoleSelect(item.role)}
                    >
                      <Badge
                        style={[
                          styles.roleBadge,
                          {
                            backgroundColor: theme.colors.roles[item.role] || '#1976D2',
                          },
                        ]}
                        size={24}
                      >
                        {item.title}
                      </Badge>
                      <RoleDescriptionForRoleCard items={getRoleDescriptionArray(item.role)} />
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
  inputTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.input.requiredLabelText,
  },
  picker: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 1.2,
    borderColor: theme.colors.input.requiredFieldBorder,
    borderRadius: 10,
    padding: 8,
    paddingRight: 10,
    marginBottom: 18,
  },
  pickerText: {
    fontSize: 16,
  },
  placeholder: {
    color: theme.colors.placeholder,
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
    paddingVertical: 8,
    marginVertical: 10,
    marginHorizontal: 16,
    borderRadius: 12,
    elevation: 1,
  },
  roleBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 16,
    marginLeft: 6,
    marginBottom: 8,
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
});

export default RolePicker;
