// ScrollableContent.tsx
import { LinearGradient } from 'expo-linear-gradient'; // Import from expo-linear-gradient
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Chip } from 'react-native-paper';

import { GroupOfLotsInterface } from '../types/types';

const ChooseZonesForTodaysLots = ({ lots }: GroupOfLotsInterface) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {lots.map((lot, index) => (
          <React.Fragment key={index}>
            <Chip
              style={styles.chip}
              mode="outlined"
              onPress={() => console.log('Pressed')}
            >
              Example Chip
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
    fontcolor: 'purple',
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
