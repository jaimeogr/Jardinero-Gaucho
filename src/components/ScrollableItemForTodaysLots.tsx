// ScrollableItemForTodaysLots.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

import { theme } from '../styles/styles';

// Define the type or interface for the props
interface ScrollableItemProps {
  number: string; // Lot number
  area: string; // Area of the lot
  neighbourhood: string; // Neighbourhood of the lot
  extraNotes?: string; // Optional extra notes about the lot
}

const ScrollableItemForTodaysLots: React.FC<ScrollableItemProps> = ({
  number,
  area,
  neighbourhood,
  extraNotes,
}) => {
  return (
    <View style={styles.scrollItem}>
      {/* Display the props in a formatted way */}
      <View style={styles.itemInfo}>
        <Text style={styles.itemText}>
          Número: {number} - Área: {area} - Barrio: {neighbourhood}
        </Text>
        {extraNotes ? (
          <Text style={styles.extraNotes}>{extraNotes}</Text>
        ) : null}
      </View>
      <MaterialCommunityIcons
        name="check-circle-outline"
        color={theme.colors.tertiary}
        size={32}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginVertical: 7,
    borderRadius: 12,
  },
  itemInfo: {
    flexDirection: 'column',
    flex: 1,
    paddingRight: 8, // Ensure space between text and icon
  },
  itemText: {
    fontSize: 16,
    color: '#333', // Adjust the color as needed
  },
  extraNotes: {
    fontSize: 14,
    color: 'gray', // Different color for extra notes to differentiate
    marginTop: 2, // Small spacing above the extra notes
  },
});

export default ScrollableItemForTodaysLots;
