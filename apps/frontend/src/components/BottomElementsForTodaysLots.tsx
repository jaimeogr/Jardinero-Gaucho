import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button, Divider } from 'react-native-paper';

import { theme } from '@/styles/styles';

const BottomElementsForTodaysLots = ({ onPress }) => {
  return (
    <View style={styles.bottomElements}>
      <Button
        style={styles.button}
        mode="outlined"
        theme={{
          colors: {
            primary: theme.colors.primary,
            outline: theme.colors.primary,
          },
        }}
        onPress={() => onPress((prevState) => !prevState)}
      >
        Administrar los Lotes de Hoy
      </Button>

      <View style={styles.allIndicators}>
        <View style={styles.indicator}>
          <Text style={styles.indicatorTitle}>Lotes Faltantes</Text>
          <Text style={styles.indicatorNumber}>3</Text>
        </View>
        <Divider style={styles.verticalDivider} />
        <View style={styles.indicator}>
          <Text style={styles.indicatorTitle}>Lotes Completados</Text>
          <Text style={styles.indicatorNumber}>5</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  button: { marginVertical: 16 },
  bottomElements: {
    alignItems: 'center',
    width: '100%',
  },
  allIndicators: {
    backgroundColor: theme.colors.background3,
    flexDirection: 'row', // Align indicators horizontally
    justifyContent: 'space-between', // Evenly distribute space
    paddingBottom: 14, // Add some spacing above the indicators
    paddingTop: 8,
    borderRadius: 14,
  },
  indicator: {
    flex: 1, // Make each indicator take equal space
    alignItems: 'center', // Center the text within the indicator
    justifyContent: 'space-evenly',
  },
  indicatorTitle: {
    marginVertical: 6,
    fontSize: 16,
  },
  indicatorNumber: {
    fontSize: 22,
    fontWeight: 'medium',
  },
  verticalDivider: {
    height: '100%', // Make the divider fill the container's height
    width: 1, // Set the width to make it a thin line
    backgroundColor: '#D1D1D1', // You can use any color you want for the divider
    alignSelf: 'center', // Align the divider in the center of the container
  },
});

export default BottomElementsForTodaysLots;
