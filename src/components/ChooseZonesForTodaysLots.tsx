import { LinearGradient } from 'expo-linear-gradient'; // Import from expo-linear-gradient
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List } from 'react-native-paper';

import DataService from '../services/DataService';
import { GroupOfLotsInterface } from '../types/types';

const ChooseZonesForTodaysLots = () => {
  const zonesOptions = DataService.getZonesOptions();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {zonesOptions.map((neighbourhood, neighbourhoodIndex) => (
          <List.Section
            key={neighbourhoodIndex}
            title={`${neighbourhood.neighbourhood} (${neighbourhood.needMowing} need mowing)`}
          >
            {neighbourhood.zones.map((zone, zoneIndex) => (
              <List.Accordion
                key={zoneIndex}
                title={`Zone ${zone.zone} - ${zone.needMowing} lots need mowing`}
                left={(props) => <List.Icon {...props} icon="map" />}
              >
                {zone.lots.map((lot, lotIndex) => (
                  <List.Item
                    key={lotIndex}
                    title={`Lot ${lot.number}`}
                    description={`Last mowed: ${lot.lastMowingDate.toDateString()}`}
                    left={(props) => (
                      <List.Icon
                        {...props}
                        icon={lot.needMowing ? 'alert' : 'check'}
                        color={lot.needMowing ? 'red' : 'green'}
                      />
                    )}
                  />
                ))}
              </List.Accordion>
            ))}
          </List.Section>
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
