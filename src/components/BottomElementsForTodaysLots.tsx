import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Divider, Text, Button } from 'react-native-paper';

const BottomElementsForTodaysLots = () => {
  return (
    <View style={styles.bottomElements}>
      <Button>Administrar los Lotes de Hoy</Button>

      <Divider bold={true} />
      <Divider
        style={{ width: '100%', backgroundColor: 'lightgray' }}
        bold={true}
      />

      <View style={styles.allIndicators}>
        <View style={styles.indicator}>
          <Text style={styles.indicatorTitle}>Lotes Faltantes</Text>
          <Text style={styles.indicatorNumber}>3</Text>
        </View>
        <View style={styles.indicator}>
          <Text style={styles.indicatorTitle}>Lotes Completados</Text>
          <Text style={styles.indicatorNumber}>5</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  bottomElements: {
    alignItems: 'center',
    padding: 16,
    width: '100%',
  },
  centerButton: {
    alignSelf: 'center', // Center the button
  },
  allIndicators: {
    flexDirection: 'row', // Align indicators horizontally
    justifyContent: 'space-between', // Evenly distribute space
    marginTop: 8, // Add some spacing above the indicators
  },
  indicator: {
    flex: 1, // Make each indicator take equal space
    alignItems: 'center', // Center the text within the indicator
  },
  indicatorTitle: {
    fontSize: 16,
  },
  indicatorNumber: {
    fontSize: 16,
  },
});

export default BottomElementsForTodaysLots;
