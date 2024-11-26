import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { Surface, Badge } from 'react-native-paper';

import ControllerService from '../services/useControllerService';
import { theme } from '../styles/styles';
import { UserRole, UserInActiveWorkgroupWithRole } from '../types/types';

type RootStackParamList = {
  MyTeam: undefined;
  InviteUser: undefined;
  EditUser: { userId: string };
};

type MyTeamScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'MyTeam'
>;

interface Props {
  navigation: MyTeamScreenNavigationProp;
}

const useUsersWithRoles = () => {
  return ControllerService.useUsersInActiveWorkgroupWithRoles();
};

const MyTeamScreen: React.FC<Props> = ({ navigation }) => {
  const users: Array<UserInActiveWorkgroupWithRole> = useUsersWithRoles();

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

  const getAccessText = (user: UserInActiveWorkgroupWithRole): string => {
    // im currently not using the assignedLotsCount because it feels visually overwhelming and it may not bring enough leverage
    const { accessToAllLots, assignedZonesCount } = user;

    if (accessToAllLots) {
      return 'Todas las zonas';
    }
    if (typeof assignedZonesCount !== 'number' || assignedZonesCount < 0) {
      return 'Datos de acceso inválidos';
    }
    if (assignedZonesCount === 0) {
      return 'Sin acceso';
    }
    const zoneWord =
      assignedZonesCount === 1 ? 'zona asignada' : 'zonas asignadas';
    return `${assignedZonesCount} ${zoneWord}`;
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
        contentContainerStyle={styles.usersList}
        data={users}
        keyExtractor={(item) => item.userId}
        renderItem={({ item }) => {
          const roleColor = theme.colors.roles[item.role] || '#1976D2';

          return (
            <Surface style={styles.userItem}>
              <View style={styles.userHeader}>
                <View style={styles.userInfo}>
                  {!item.hasAcceptedPresenceInWorkgroup ? (
                    // if user has not accepter the invitation yet
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

              <View style={styles.userAccess}>
                <Text style={styles.accessText}>{getAccessText(item)}</Text>
              </View>

              <TouchableOpacity
                style={styles.editButton}
                onPress={() =>
                  navigation.navigate('EditUser', { userId: item.userId })
                }
              >
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
  usersList: {
    paddingTop: 8,
    paddingBottom: 60,
  },
  userItem: {
    margin: 14,
    marginBottom: 6,
    padding: 16,
    paddingTop: 12,
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
    // alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
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
    marginTop: -12,
  },
  userAccess: {
    marginTop: 32,
  },
  accessText: {
    fontSize: 16,
    color: 'gray',
  },
  editButton: {
    position: 'absolute',
    bottom: 12,
    right: 14,
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
    height: 40,
    marginRight: 4,
  },
});

export default MyTeamScreen;
