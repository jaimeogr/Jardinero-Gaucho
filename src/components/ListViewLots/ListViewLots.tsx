// ScrollableContent.tsx
import { LinearGradient } from 'expo-linear-gradient'; // Import from expo-linear-gradient
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Divider } from 'react-native-paper';

import OneLotForListViewLots from './OneLotForListViewLots';
import { GroupOfLotsInterface } from '../../types/types';

const ListViewLots = ({ lots }: GroupOfLotsInterface) => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {lots.map((lot, index) => (
          <React.Fragment key={index}>
            <OneLotForListViewLots
              lotLabel={lot.lotLabel}
              zoneId={lot.zoneId}
              neighbourhoodId={lot.neighbourhoodId}
              extraNotes={lot.extraNotes}
              lastMowingDate={lot.lastMowingDate}
            />
            <Divider style={styles.divider} bold={true} />
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
  divider: {
    width: '100%',
    backgroundColor: 'lightgray',
  },
  scrollContent: {
    paddingHorizontal: 24, // Padding for the scrollable area
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

export default ListViewLots;
