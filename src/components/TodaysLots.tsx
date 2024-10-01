import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';

import BottomElementsForTodaysLots from './BottomElementsForTodaysLots';

const TodaysLots = () => {
  return (
    <Surface style={styles.surface}>
      <Text style={styles.title}>Lotes de hoy</Text>

      <View style={styles.cardContent}>
        <Text>Lotes de hoy contenido</Text>
        <BottomElementsForTodaysLots />
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  surface: {
    flex: 1,
    elevation: 4, // Elevation to create a shadow effect
    borderRadius: 16, // Rounded corners for a modern look
    backgroundColor: 'white', // Background color for the surface
    flexDirection: 'column', // Layout with icon and text side by side
    alignItems: 'center', // Center the content vertically
    marginBottom: 12,
  },
  cardContent: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
  },
  todaysLots: {
    flex: 1,
    marginBottom: 16,
    padding: 0,
  },
  title: {
    fontSize: 24,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingTop: 8,
  },
});
export default TodaysLots;
