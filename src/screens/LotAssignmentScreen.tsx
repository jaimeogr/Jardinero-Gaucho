// src/screens/LotAssignmentScreen.tsx

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
  Modal,
  Alert,
} from 'react-native';

import CustomAccordion from '../components/NestedViewLots/CustomAccordion';
import OneLotForCustomAccordion from '../components/NestedViewLots/OneLotForCustomAccordion';
import ControllerService from '../services/useControllerService';
import { theme } from '../styles/styles';
import {
  NestedLotsWithIndicatorsInterface,
  UserInterface,
} from '../types/types';

type RootStackParamList = {
  LotAssignment: undefined;
  // Other routes...
};

type LotAssignmentScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LotAssignment'
>;

interface Props {
  navigation: LotAssignmentScreenNavigationProp;
}

const LotAssignmentScreen: React.FC<Props> = ({ navigation }) => {
  const {
    useNestedLotsWithAssignments,
    assignMembersToSelectedLots,
    toggleLotSelection,
    deselectAllLots,
    getUsersInActiveWorkgroupWithRoles,
    getUserById,
  } = ControllerService;

  const { nestedLots } = useNestedLotsWithAssignments();
  const [assigneeModalVisible, setAssigneeModalVisible] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);

  // Clear selections when the screen is focused
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      deselectAllLots();
    });
    return unsubscribe;
  }, [navigation]);

  // Handler for lot selection
  const handleLotToggle = (lotId: string) => {
    toggleLotSelection(lotId);
  };

  // Handler for assigning members
  const handleAssignMembers = () => {
    if (selectedUserIds.length === 0) {
      Alert.alert(
        'Selecciona integrantes',
        'Debes seleccionar al menos un integrante.',
      );
      return;
    }
    assignMembersToSelectedLots(selectedUserIds);
    setAssigneeModalVisible(false);
    setSelectedUserIds([]);
    deselectAllLots();
  };

  // Function to get user initials
  const getUserInitials = (userId: string) => {
    const user = getUserById(userId);
    if (user) {
      return (
        user.firstName.charAt(0).toUpperCase() +
        user.lastName.charAt(0).toUpperCase()
      );
    }
    return '';
  };

  // Get team members for the modal
  const teamMembers = getUsersInActiveWorkgroupWithRoles();

  // Render the nested lots similar to NestedViewLots component

  return (
    <View style={styles.container}>
      <FlatList
        data={nestedLots}
        keyExtractor={(item) => item.neighbourhoodId}
        renderItem={({ item: neighbourhood }) => (
          <CustomAccordion
            id={neighbourhood.neighbourhoodId}
            title={neighbourhood.neighbourhoodLabel}
            level={0}
            thisWeeksNormalLotsToMow={neighbourhood.needMowing}
            thisWeeksCriticalLotsToMow={neighbourhood.needMowingCritically}
            isSelected={neighbourhood.isSelected}
          >
            {neighbourhood.zones.map((zone) => (
              <CustomAccordion
                id={zone.zoneId}
                title={`Zona ${zone.zoneLabel}`}
                level={1}
                thisWeeksNormalLotsToMow={zone.needMowing}
                thisWeeksCriticalLotsToMow={zone.needMowingCritically}
                isSelected={zone.isSelected}
                key={zone.zoneId}
              >
                {zone.lots.map((lot, index) => (
                  <OneLotForCustomAccordion
                    key={lot.lotId}
                    lotId={lot.lotId}
                    isLastItem={index === zone.lots.length - 1}
                    onLotPress={() => handleLotToggle(lot.lotId)}
                    assignedTo={lot.assignedTo}
                    getUserInitials={getUserInitials}
                  />
                ))}
              </CustomAccordion>
            ))}
          </CustomAccordion>
        )}
      />

      {/* Sticky Footer Button */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.assignButton}
          onPress={() => setAssigneeModalVisible(true)}
        >
          <Text style={styles.assignButtonText}>Seleccionar Integrantes</Text>
        </TouchableOpacity>
      </View>

      {/* Assignee Selection Modal */}
      <Modal
        visible={assigneeModalVisible}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Seleccionar Integrantes</Text>
            {/* Use a FlatList to render team members with checkboxes */}
            <FlatList
              data={teamMembers}
              keyExtractor={(item) => item.userId}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    if (selectedUserIds.includes(item.userId)) {
                      setSelectedUserIds(
                        selectedUserIds.filter((id) => id !== item.userId),
                      );
                    } else {
                      setSelectedUserIds([...selectedUserIds, item.userId]);
                    }
                  }}
                  style={styles.userItem}
                >
                  <View style={styles.userInfo}>
                    <Text>
                      {item.firstName} {item.lastName}
                    </Text>
                  </View>
                  {selectedUserIds.includes(item.userId) && (
                    <Icon name="check" size={20} color={theme.colors.primary} />
                  )}
                </TouchableOpacity>
              )}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.modalCancelButton}
                onPress={() => setAssigneeModalVisible(false)}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalAddButton}
                onPress={handleAssignMembers}
              >
                <Text style={styles.modalButtonText}>
                  Asignar Integrantes a Lotes Seleccionados
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

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
  // Your styles here
});

export default LotAssignmentScreen;
