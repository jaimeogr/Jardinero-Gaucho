import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-paper';

import LotService from '../../services/LotService';
import useLotStore from '../../stores/useLotStore';
import { theme } from '../../styles/styles';
import { LotInterface } from '../../types/types';

interface OneLotForCustomAccordionProps {
  title: string;
  description: string;
  lotId: number; // Use LotInterface to type the lot prop
  isLastItem: boolean;
}

const OneLotForCustomAccordion: React.FC<OneLotForCustomAccordionProps> = ({
  title,
  description,
  isLastItem,
  lotId,
}) => {
  console.log('lot ID:');
  console.log(lotId);

  // Use useLotStore with a state selector to get only the relevant data to avoid unnecessary re-renders
  const lot = useLotStore((state) =>
    state.lots.find((lot) => lot.id === lotId),
  );
  const toggleLotSelection = useLotStore((state) => state.toggleLotSelection);

  // Wrap the toggle function with useCallback to avoid creating a new function on each render
  const handleToggle = useCallback(() => {
    toggleLotSelection(lotId);
  }, [toggleLotSelection, lotId]);

  // Ensure that if the lot is not found, we don't trigger re-renders unnecessarily
  if (!lot) {
    return null;
  }

  return (
    <View>
      <TouchableOpacity
        style={
          lot.isSelected
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
            name={lot.isSelected ? 'circle-slice-8' : 'circle-outline'}
            color={theme.colors.primary}
            size={28}
          />
        </TouchableOpacity>

        {/* Title and Description */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{lot.number}</Text>
          <Text style={styles.description}>{description}</Text>
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
      {lot.isSelected || isLastItem ? null : (
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
    backgroundColor: '#e0f7fa', // Light blue for selected items across all levels
    borderColor: '#00796b', // Optional border for emphasis
    borderWidth: 1,
    borderRadius: 10,
  },
  divider: {
    width: '95%',
    backgroundColor: 'lightgray',
    alignSelf: 'center',
  },
});

export default OneLotForCustomAccordion;
