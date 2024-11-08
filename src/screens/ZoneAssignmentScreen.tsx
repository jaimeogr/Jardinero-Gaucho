// src/screens/LotAssignmentScreen.tsx

import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ScrollView,
  FlatList,
  Modal,
} from 'react-native';

import CustomAccordion from '../components/NestedViewLots/CustomAccordion';
import NestedViewLots from '../components/NestedViewLots/NestedViewLots';
import OneLotForCustomAccordion from '../components/NestedViewLots/OneLotForCustomAccordion';
import ControllerService from '../services/useControllerService';
import { theme } from '../styles/styles';
import {
  UserInterface,
  UserInvitedPendingAcceptanceInterface,
} from '../types/types';

type RootStackParamList = {
  ZoneAssignment: undefined;
  // Other routes...
};

type LotAssignmentScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'ZoneAssignment'
>;

interface Props {
  navigation: LotAssignmentScreenNavigationProp;
  route: any;
}

const ZoneAssignmentScreen: React.FC<Props> = ({ navigation, route }) => {
  const {
    assignMemberToSelectedLots,
    deselectAllLots,
    getUsersInActiveWorkgroupWithRoles,
  } = ControllerService;

  const { newUser } = route.params;

  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [dropdownVisible, setDropdownVisible] = useState<boolean>(false);

  // Clear selections when the screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      deselectAllLots();
    });
    return unsubscribe;
  }, [navigation, deselectAllLots]);

  // Handler for deselecting lots
  const handleDeselectLots = useCallback(() => {
    deselectAllLots();
  }, [deselectAllLots]);

  // Handler for assigning member
  const handleAssignMember = () => {
    if (!selectedUserId) {
      Alert.alert(
        'Selecciona un integrante',
        'Debes seleccionar un integrante.',
      );
      return;
    }
    assignMemberToSelectedLots(selectedUserId);
    setSelectedUserId(null);
    deselectAllLots();
    Alert.alert('Asignación exitosa', 'Los lotes han sido asignados.');
  };

  // Render right-side for one lot
  const renderRightSideForOneLot = useCallback(() => {
    return null; // No right-side icon for lots in assignment screen
  }, []);

  // Render right-side for accordion (zones and neighborhoods)
  const renderRightSideForAccordion = useCallback(() => {
    return null; // No right-side icon for accordions in assignment screen
  }, []);

  // Get team members for the dropdown
  const teamMembers = getUsersInActiveWorkgroupWithRoles();

  // Function to render the badge or dropdown
  const renderUserSelection = () => {
    const selectedUser = teamMembers.find(
      (user) => user.userId === selectedUserId,
    );

    return (
      <View>
        <TouchableOpacity
          style={styles.userSelectionTouchable}
          onPress={() => setDropdownVisible(!dropdownVisible)}
        >
          {selectedUser || newUser ? (
            <View style={styles.badgeContainer}>
              <Text style={styles.badgeText}>
                {/* if zones are being selected for a new user or for a selecteduser */}
                {newUser ? newUser.email : null}
                {selectedUser
                  ? `${selectedUser.firstName} ${selectedUser.lastName}`
                  : null}
              </Text>
            </View>
          ) : (
            <Text style={styles.dropdownPlaceholderText}>
              Seleccionar integrante
            </Text>
          )}
          {/* if its a newUser creation then it will not render the icon */}
          {!newUser && (
            <Icon
              name={dropdownVisible ? 'chevron-up' : 'chevron-down'}
              size={24}
              color="#000"
            />
          )}
        </TouchableOpacity>

        {/* if there is a newUser then it will not be able to select another option */}
        {dropdownVisible && !newUser && (
          <View style={styles.dropdownMenu}>
            <ScrollView>
              {teamMembers.map((user) => (
                <TouchableOpacity
                  key={user.userId}
                  style={styles.dropdownItem}
                  onPress={() => {
                    setSelectedUserId(user.userId);
                    setDropdownVisible(false);
                  }}
                >
                  <Text style={styles.dropdownItemText}>
                    {user.firstName} {user.lastName}
                  </Text>
                  {selectedUserId === user.userId && (
                    <Icon name="check" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {/* Render the user selection dropdown */}
      <View style={styles.userSelectionContainer}>{renderUserSelection()}</View>

      {/* Render the nested lots */}
      <NestedViewLots
        handleDeselectLots={handleDeselectLots}
        renderRightSideForAccordion={renderRightSideForAccordion}
        renderRightSideForOneLot={renderRightSideForOneLot}
        title="seleccionar zonas:"
        onlyZonesAreSelectable={true}
        expandNeighbourhood={true}
      />

      {/* Button to assign the selected lots */}
      <TouchableOpacity style={styles.button} onPress={handleAssignMember}>
        <Text style={styles.buttonText}>Asignar Zonas</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  userSelectionContainer: {
    padding: 16,
    backgroundColor: 'white',
  },
  userSelectionTouchable: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  badgeContainer: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 6,
    paddingHorizontal: 12,
  },
  badgeText: {
    color: 'white',
    fontWeight: 'bold',
  },
  dropdownPlaceholderText: {
    color: '#999',
    fontSize: 16,
  },
  dropdownMenu: {
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    backgroundColor: 'white',
    maxHeight: 200, // Limit height if you have many team members
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dropdownItemText: {
    fontSize: 16,
  },
  button: {
    backgroundColor: theme.colors.primary,
    borderRadius: 50,
    paddingVertical: 16,
    alignItems: 'center',
    margin: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ZoneAssignmentScreen;
