// ScrollableContent.tsx
import { LinearGradient } from 'expo-linear-gradient'; // Import from expo-linear-gradient
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Chip } from 'react-native-paper';

import DataService from '../services/DataService';
import { GroupOfLotsInterface } from '../types/types';

const ChooseZonesForTodaysLots = ({ lots }: GroupOfLotsInterface) => {
  const zonesOptions = DataService.getZonesOptions();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {zonesOptions.map((zone, index) => (
          <React.Fragment key={index}>
            <Chip style={styles.chip} mode="outlined" onPress={() => null}>
              {zone.neighbourhood} - {zone.needMowing} lots
            </Chip>
          </React.Fragment>
        ))}
      </ScrollView>

      {/* Fade effect at the bottom */}
      <LinearGradient
        colors={['transparent', 'rgba(255, 255, 255, 0.8)']} // Adjust colors for the fade effect
        style={styles.fadeEffect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24, // Padding for the scrollable area
  },
  chip: {
    borderColor: 'purple',
    borderRadius: 32,
    borderWidth: 3,
    marginVertical: 8,
  },
  fadeEffect: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 20, // Adjust the height of the fade effect
    marginRight: 4, // Padding to match the scrollable area
  },
});

export default ChooseZonesForTodaysLots;
