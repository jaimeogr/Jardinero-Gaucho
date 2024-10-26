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
import { Surface, Badge } from 'react-native-paper';

import ControllerService from '../services/useControllerService';
import { theme } from '../styles/styles';
import { UserInterface, UserRole } from '../types/types';

type RootStackParamList = {
  MyTeam: undefined;
  InviteUser: undefined;
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

  useEffect(() => {
    const fetchUsers = () => {
      const usersWithRoles =
        ControllerService.getUsersInActiveWorkgroupWithRoles();
      setUsers(usersWithRoles);
    };
    fetchUsers();
  }, []);

  const integrantesCount = users.length;

  const getRoleBadgeText = (role: UserRole) => {
    switch (role) {
      case 'PrimaryOwner':
        return 'Socio Principal';
      case 'Owner':
        return 'Socio';
      case 'Manager':
        return 'Administrador';
      default:
        return 'Jardinero';
    }
  };

  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <Text style={styles.title}>Mi Equipo</Text>
        <View style={styles.headerRow}>
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

          const roleColor = theme.colors.roles[item.role] || '#1976D2';

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
                      <View style={styles.userNameAndBadge}>
                        <Text style={styles.userName}>
                          {item.firstName.charAt(0).toUpperCase() +
                            item.firstName.slice(1)}{' '}
                          {item.lastName.charAt(0).toUpperCase() +
                            item.lastName.slice(1)}
                        </Text>
                        <Badge
                          style={[
                            styles.roleBadge,
                            { backgroundColor: roleColor },
                          ]}
                          size={24}
                        >
                          {getRoleBadgeText(item.role)}
                        </Badge>
                      </View>

                      <Text style={styles.userEmail}>{item.email}</Text>
                    </>
                  )}
                </View>
              </View>

              <View style={styles.userBody}>
                <Text style={styles.accessText}>Acceso: {accessText}</Text>
              </View>

              <TouchableOpacity style={styles.editButton}>
                <Icon name="pencil" size={20} color="#1976D2" />
                <Text style={styles.editButtonText}>Editar</Text>
              </TouchableOpacity>
            </Surface>
          );
        }}
      />
      <LinearGradient
        colors={['transparent', 'rgba(255, 255, 255, 0.9)']}
        style={styles.gradientOverlay}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
    width: '100%',
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,

    // Elevation for Android
    elevation: 3,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  integrantesCount: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'gray',
  },
  inviteButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 50,
  },
  inviteButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  userItem: {
    margin: 14,
    marginBottom: 6,
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    elevation: 2,
  },
  userHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userNameAndBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userWaitingText: {
    fontSize: 18,
    color: 'gray',
    fontWeight: 'bold',
  },
  userEmail: {
    fontSize: 16,
    color: 'gray',
  },
  roleBadge: {
    paddingHorizontal: 8,
    borderRadius: 8,
    fontWeight: 'bold',
    fontSize: 14,
  },
  userBody: {
    marginTop: 8,
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
    backgroundColor: '#E3F2FD',
    padding: 8,
    borderRadius: 8,
  },
  editButtonText: {
    fontSize: 16,
    color: '#1976D2',
    marginLeft: 4,
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 30,
    marginRight: 4,
  },
});

export default MyTeamScreen;
