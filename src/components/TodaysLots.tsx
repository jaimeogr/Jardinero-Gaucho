import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';

import ControllerService from '../services/useControllerService';
import NestedViewLots from './NestedViewLots/NestedViewLots';

const TodaysLots = () => {
  useEffect(() => {
    ControllerService.initializeServices();
  }, []);

  return (
    <Surface style={styles.surface}>
      <View style={styles.content}>
        <NestedViewLots />
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  surface: {
    flex: 1,
    elevation: 4, // Elevation to create a shadow effect
    borderRadius: 12, // Rounded corners for a modern look
    backgroundColor: 'white', // Background color for the surface
    flexDirection: 'column', // Layout with icon and text side by side
    alignItems: 'center', // Center the content vertically
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
  },
});
export default TodaysLots;
