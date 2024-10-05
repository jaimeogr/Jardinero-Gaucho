import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';

import AllLotsForTodaysLots from './AllLotsForTodaysLots';
import BottomElementsForTodaysLots from './BottomElementsForTodaysLots';
import ChooseZonesForTodaysLots from './ChooseZonesForTodaysLots';
import DataService from '../../services/DataService';
import { LotInterface } from '../../types/types';

const TodaysLots = () => {
  const [lots, setLots] = useState<LotInterface[]>([]);

  useEffect(() => {
    const fetchedLots = DataService.getLotsForToday();
    setLots(fetchedLots);
  }, []); // Empty dependency array ensures it runs once when the component mounts

  return (
    <Surface style={styles.surface}>
      <Text style={styles.title}>Lotes de hoy</Text>

      <View style={styles.content}>
        {true ? (
          <ChooseZonesForTodaysLots />
        ) : (
          <AllLotsForTodaysLots lots={lots} />
        )}
        <BottomElementsForTodaysLots />
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
  },
  content: {
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
    paddingTop: 12,
    marginLeft: 24,
    marginBottom: 12,
  },
});
export default TodaysLots;
