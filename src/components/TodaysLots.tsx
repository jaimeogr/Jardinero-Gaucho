import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Surface } from 'react-native-paper';

import BottomElementsForTodaysLots from './BottomElementsForTodaysLots';
import ListViewLots from './ListViewLots/ListViewLots';
import ControllerService from '../services/useControllerService';
import LotsNestedView from './NestedViewLots/NestedViewLots';

const TodaysLots = () => {
  const [selectingLots, setSelectingLots] = useState(true);

  useEffect(() => {
    ControllerService.initializeServices();
  }, []);

  return (
    <Surface style={styles.surface}>
      {selectingLots ? (
        <View style={styles.content}>
          <LotsNestedView />
        </View>
      ) : (
        <View style={styles.content}>
          <Text style={styles.title}>Mis lotes de hoy</Text>
          {/* <ListViewLots lots={lots} /> */}
          <BottomElementsForTodaysLots onPress={setSelectingLots} />
        </View>
      )}
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
