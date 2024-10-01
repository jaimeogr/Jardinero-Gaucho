import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Divider, Card, Text, Button, Surface } from 'react-native-paper';

const TodaysLots = () => {
  return (
    <Surface style={styles.surface}>
      <Text style={styles.title}>Lotes de hoy</Text>

      <View style={styles.cardContent}>
        <Text>Lotes de hoy contenido</Text>
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
export default TodaysLots;
