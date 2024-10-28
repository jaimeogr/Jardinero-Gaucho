import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-paper';

import useControllerService from '../../services/useControllerService';
import { theme } from '../../styles/styles';

const {
  lotBackgroundNotSelected,
  lotBorderNotSelected,
  lotBackgroundSelected,
  lotBorderSelected,
} = theme.colors.accordion;

interface OneLotForCustomAccordionProps {
  lotId: string; // Use LotInterface to type the lot prop
  isLastItem: boolean;
}

const OneLotForCustomAccordion: React.FC<OneLotForCustomAccordionProps> = ({
  isLastItem,
  lotId,
}) => {
  const { getLotById, toggleLotSelection } = useControllerService;
  // Use useLotStore with a state selector to get only the relevant data to avoid unnecessary re-renders
  const lot = getLotById(lotId);

  // Wrap the toggle function with useCallback to avoid creating a new function on each render
  const handleToggle = useCallback(() => {
    toggleLotSelection(lotId, !lot.lotIsSelected);
  }, [toggleLotSelection, lotId, lot]);

  // Ensure that if the lot is not found, we don't trigger re-renders unnecessarily
  if (!lot) {
    return null;
  }

  return (
    <View>
      <TouchableOpacity
        style={
          lot.lotIsSelected
            ? [styles.container, styles.lotIsSelected]
            : styles.container
        }
      >
        {/* Left Icon */}
        <TouchableOpacity
          onPress={handleToggle}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Increases pressable area without affecting visual size
        >
          <MaterialCommunityIcons
            name={lot.lotIsSelected ? 'circle-slice-8' : 'circle-outline'}
            color={theme.colors.primary}
            size={28}
          />
        </TouchableOpacity>

        {/* Title and Description */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{lot.lotLabel}</Text>
          <Text style={styles.description}>
            {lot.lastMowingDate
              ? 'Ultima Pasada ' + lot.lastMowingDate.toDateString()
              : null}
          </Text>
        </View>

        {/* Right Side */}
        <TouchableOpacity style={styles.rightIconContainer}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={28}
            color="orange"
          />
        </TouchableOpacity>
      </TouchableOpacity>
      {/* divider at the bottom of the item renders when the item is not selected and when its not the last item in the iteration. */}
      {lot.lotIsSelected || isLastItem ? null : (
        <Divider style={styles.divider} bold={true} />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: lotBackgroundNotSelected,
    borderColor: lotBorderNotSelected,
  },
  leftIconContainer: {
    paddingHorizontal: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  description: {
    color: '#888',
    fontSize: 14,
  },
  rightIconContainer: {
    paddingHorizontal: 10,
  },
  lotIsSelected: {
    backgroundColor: lotBackgroundSelected, // Light blue for selected items across all levels
    borderColor: lotBorderSelected, // Optional border for emphasis
  },
  divider: {
    width: '95%',
    backgroundColor: 'lightgray',
    alignSelf: 'center',
  },
});

export default OneLotForCustomAccordion;
