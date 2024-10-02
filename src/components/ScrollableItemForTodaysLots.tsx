// ScrollableItemForTodaysLots.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { TouchableRipple } from 'react-native-paper';

import { theme } from '../styles/styles';

// Define the type or interface for the props
interface ScrollableItemProps {
  number: string; // Lot number
  area: string; // Area of the lot
  neighbourhood: string; // Neighbourhood of the lot
  completed: boolean;
  extraNotes?: string; // Optional extra notes about the lot
}

const ScrollableItemForTodaysLots: React.FC<ScrollableItemProps> = ({
  number,
  area,
  neighbourhood,
  completed,
  extraNotes,
}) => {
  const [compl, setCompl] = useState(completed);

  return (
    <TouchableRipple onPress={() => null} rippleColor={theme.colors.ripple}>
      <View style={styles.scrollItem}>
        <View style={styles.itemInfo}>
          <Text style={styles.itemText}>
            Número: {number} - Área: {area} - Barrio: {neighbourhood}
          </Text>
          {extraNotes ? (
            <Text style={styles.extraNotes}>{extraNotes}</Text>
          ) : null}
        </View>
        <TouchableOpacity onPress={() => setCompl(!compl)}>
          <MaterialCommunityIcons
            name={compl ? 'check-circle' : 'check-circle-outline'}
            color={compl ? theme.colors.green : theme.colors.gray}
            size={32}
          />
        </TouchableOpacity>
      </View>
    </TouchableRipple>
  );
};

const styles = StyleSheet.create({
  scrollItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginVertical: 14,
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
