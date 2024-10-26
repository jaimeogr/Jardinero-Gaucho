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

import ControllerService from '../services/useControllerService';
import { theme } from '../styles/styles';
import { UserInterface, UserRole } from '../types/types';

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
  }, []);

  // Count of integrantes
  const integrantesCount = users.length;

  const getRoleChipText = (role: UserRole) => {
    if (role === 'PrimaryOwner') return 'Socio Principal';
    if (role === 'Owner') return 'Socio';
    if (role === 'Manager') return 'Administrador';
    if (role === 'Member') return 'Jardinero';
  };

  return (
    <View style={styles.container}>
      {/* Title and Add Button */}
      <View style={styles.header}>
        <Text style={styles.title}>Mi Equipo</Text>
        <View style={styles.headerRight}>
          <Text style={styles.integrantesCount}>
            Integrantes: {integrantesCount}
          </Text>
          <TouchableOpacity
            style={styles.inviteButton}
            onPress={() => navigation.navigate('InviteUser')}
          >
            <Text style={styles.inviteButtonText}>Agregar Integrante</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={users}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => {
          const hasAcceptedPresenceInWorkgroup =
            !item.hasAcceptedPresenceInWorkgroup;
          const accessText = item.accessToAllLots
            ? 'Todos los lotes'
            : `${item.assignedLotsCount} lotes`;

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
                        {item.firstName.charAt(0).toUpperCase() +
                          item.firstName.slice(1)}{' '}
                        {item.lastName.charAt(0).toUpperCase() +
                          item.lastName.slice(1)}
                      </Text>
                      <Text style={styles.userEmail}>{item.email}</Text>
                    </>
                  )}
                </View>

                {/* Role Chip - Top Right Corner */}
                <Chip
                  mode="outlined"
                  style={[
                    styles.roleChip,
                    { borderColor: roleColor, backgroundColor: roleColor },
                  ]}
                  textStyle={{ color: '#fff', fontWeight: 'bold' }}
                >
                  {getRoleChipText(item.role)}
                </Chip>
              </View>

              <View style={styles.userBody}>
                <Text style={styles.accessText}>Acceso: {accessText}</Text>
              </View>

              {/* Edit Button - Bottom Right Corner */}
              <TouchableOpacity
                onPress={() => {
                  /* Add edit function here */
                }}
                style={styles.editButton}
              >
                <Icon name="pencil" size={20} color={theme.colors.primary} />
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
            </Surface>
          );
        }}
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
  header: {
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  headerRight: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  integrantesCount: {
    fontSize: 18,
    color: theme.colors.primary,
    fontWeight: 'bold',
  },
  inviteButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
    alignItems: 'center',
  },
  inviteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  userItem: {
    marginBottom: 16,
    padding: 16,
    elevation: 2,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userWaitingText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'gray',
  },
  userEmail: {
    fontSize: 16,
    color: 'gray',
  },
  roleChip: {
    alignSelf: 'flex-start',
    borderRadius: 50,
    marginTop: -8,
  },
  userBody: {
    marginTop: 12,
  },
  accessText: {
    fontSize: 16,
    color: 'gray',
  },
  editButton: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: theme.colors.primary,
    padding: 6,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 16,
    color: theme.colors.primary,
    marginLeft: 4,
  },
});

export default MyTeamScreen;
