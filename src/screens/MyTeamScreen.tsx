// src/screens/MyTeamScreen.tsx

import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Surface, Chip } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';

import ControllerService from '../services/useControllerService';
import { theme } from '../styles/styles';
import { UserInterface, UserRole, LotInterface } from '../types/types';

type RootStackParamList = {
  MyTeam: undefined;
  InviteUser: undefined;
  // other routes...
};

type MyTeamScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MyTeam'
>;

interface Props {
  navigation: MyTeamScreenNavigationProp;
}

const MyTeamScreen: React.FC<Props> = ({ navigation }) => {
  const [users, setUsers] = useState<
    Array<
      UserInterface & {
        role: UserRole;
        accessToAllLots: boolean;
        hasAcceptedPresenceInWorkgroup: boolean;
        assignedLotsCount: number;
      }
    >
  >([]);

  // Fetch users when component mounts
  useEffect(() => {
    const fetchUsers = () => {
      const usersWithRoles =
        ControllerService.getUsersInActiveWorkgroupWithRoles();

      setUsers(usersWithRoles);
    };

    fetchUsers();
    // Optionally, set up a subscription to data changes here
  }, []);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    if (newRole === 'PrimaryOwner') {
      Alert.alert(
        'No se puede asignar rol de Propietario Principal',
        'Sólo se permite un Propietario Principal.',
      );
      return;
    }
    const success = ControllerService.updateUserRoleInActiveWorkgroup(
      userId,
      newRole,
    );
    if (success) {
      // Update the users list
      const updatedUsers = users.map((user) => {
        if (user.userId === userId) {
          return { ...user, role: newRole };
        }
        return user;
      });
      setUsers(updatedUsers);
    }
  };

  const handleAccessToAllLotsChange = (userId: string, access: boolean) => {
    ControllerService.updateUserAccessToAllLots(userId, access);
    // Update the users list
    const updatedUsers = users.map((user) => {
      if (user.userId === userId) {
        return { ...user, accessToAllLots: access };
      }
      return user;
    });
    setUsers(updatedUsers);
  };

  const handleRemoveUser = (userId: string) => {
    Alert.alert(
      'Eliminar integrante',
      '¿Estás seguro de que deseas eliminar este integrante del equipo?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            // Implement remove user logic
            // For now, remove user from local state
            const updatedUsers = users.filter((user) => user.userId !== userId);
            setUsers(updatedUsers);
          },
        },
      ],
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => {
          const hasAcceptedPresenceInWorkgroup =
            !item.hasAcceptedPresenceInWorkgroup;
          const accessToAllLots = item.accessToAllLots;
          const assignedLotsText = accessToAllLots ? 'Todos' : 'Seleccionados';

          // Define colors for roles
          const roleColors = {
            PrimaryOwner: '#D32F2F', // Red
            Owner: '#F57C00', // Orange
            Manager: '#1976D2', // Blue
            Member: '#388E3C', // Green
          };
          const roleColor = roleColors[item.role] || theme.colors.primary;

          return (
            <Surface style={styles.userItem}>
              <View style={styles.userHeader}>
                <View style={styles.userInfo}>
                  {hasAcceptedPresenceInWorkgroup ? (
                    <>
                      <Text style={styles.userWaitingText}>
                        Esperando que acepte la invitación
                      </Text>
                      <Text style={styles.userEmail}>{item.email}</Text>
                    </>
                  ) : (
                    <>
                      <Text style={styles.userName}>
                        {item.firstName} {item.lastName}
                      </Text>
                      <Text style={styles.userEmail}>{item.email}</Text>
                    </>
                  )}
                </View>
                <Chip
                  mode="outlined"
                  style={[
                    styles.roleChip,
                    { borderColor: roleColor, backgroundColor: roleColor },
                  ]}
                  textStyle={{ color: '#fff', fontWeight: 'bold' }}
                >
                  {item.role}
                </Chip>
              </View>

              <View style={styles.userBody}>
                <Text style={styles.assignedLotsText}>
                  Lotes asignados: {assignedLotsText}
                </Text>
                {/* Switch or Picker for accessToAllLots */}
                <View style={styles.switchContainer}>
                  <Text style={styles.switchLabel}>
                    Acceso a todos los lotes
                  </Text>
                  <RNPickerSelect
                    onValueChange={(value) =>
                      handleAccessToAllLotsChange(item.userId, value)
                    }
                    items={[
                      { label: 'Sí', value: true },
                      { label: 'No', value: false },
                    ]}
                    value={item.accessToAllLots}
                    style={pickerSelectStyles}
                    useNativeAndroidPickerStyle={false}
                  />
                </View>
              </View>

              {/* Delete icon */}
              {item.role !== 'PrimaryOwner' && (
                <TouchableOpacity
                  onPress={() => handleRemoveUser(item.userId)}
                  style={styles.deleteButton}
                >
                  <Icon name="delete" size={24} color="red" />
                </TouchableOpacity>
              )}
            </Surface>
          );
        }}
        ListHeaderComponent={
          <View>
            <TouchableOpacity
              style={styles.inviteButton}
              onPress={() => navigation.navigate('InviteUser')}
            >
              <Text style={styles.inviteButtonText}>Agregar Integrante</Text>
            </TouchableOpacity>
          </View>
        }
      />
      {/* Gradient at the bottom */}
      <LinearGradient
        colors={['transparent', 'rgba(255, 255, 255, 0.9)']}
        style={styles.gradientOverlay}
        pointerEvents="none"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 30,
    zIndex: 1,
    elevation: 10,
    marginRight: 4,
  },
  userItem: {
    marginBottom: 12,
    padding: 16,
    elevation: 2,
    borderRadius: 12,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  userWaitingText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'gray',
  },
  userEmail: {
    fontSize: 14,
    color: 'gray',
  },
  roleChip: {
    alignSelf: 'flex-start',
    borderRadius: 50,
  },
  userBody: {
    marginTop: 12,
  },
  assignedLotsText: {
    fontSize: 14,
    color: 'gray',
  },
  switchContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  switchLabel: {
    fontSize: 14,
    marginRight: 8,
  },
  deleteButton: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  inviteButton: {
    backgroundColor: theme.colors.primary,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  inviteButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 14,
    paddingVertical: 8,
    paddingHorizontal: 10,
    color: 'black',
    paddingRight: 30,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 10,
  },
  inputAndroid: {
    fontSize: 14,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'black',
    paddingRight: 30,
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 10,
  },
  placeholder: {
    color: '#aaa',
  },
});

export default MyTeamScreen;
