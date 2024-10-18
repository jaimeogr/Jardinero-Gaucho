// src/screens/HomeScreen.js
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient from expo-linear-gradient
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';

import ClickableRoundButton from '../components/ClickableRoundButton';
import TodaysLots from '../components/TodaysLots';
import ControllerService from '../services/useControllerService';
import { theme } from '../styles/styles';

const { createLot } = ControllerService;

const HomeScreen = ({ navigation }) => {
  const handleCreateLot = () => {
    const newLot = {
      lotId: 'bafb7a5c-8a25-4e79-8df2-124153c34390',
      lotLabel: '58 - nuevo lote',
      zoneId: '9e373c57-26a3-42ab-97a0-4235c6baf39f',
      zoneLabel: '1',
      neighbourhoodId: '33f8e2a5-f56e-4bfc-94b4-12e1a6cf8b24',
      neighbourhoodLabel: 'El Naudir',
      lastMowingDate: new Date('2024-10-19'),
      lotIsSelected: false,
      assignedTo: [],
      workgroupId: '1',
    };

    const success = createLot(newLot);
    if (success) {
      console.log('created a new lot.');
    } else {
      console.error('Failuer: no lot was created.');
    }
  };

  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.background2]} // Define the gradient colors
      style={styles.gradient} // Apply the gradient to the entire container
      start={{ x: 0.5, y: 0.6 }} // Start the gradient from the top center
      end={{ x: 0.5, y: 0.95 }} // End the gradient at the bottom center
    >
      <View style={styles.homeElements}>
        <Surface style={styles.surfaceTopRoundButtons}>
          <ClickableRoundButton
            title="Registrar Cobro"
            iconName="cash-plus"
            onPress={() => navigation.navigate('LotManagement')}
          />
          <ClickableRoundButton
            title="Administrar Lotes"
            iconName="home-group"
            onPress={() => navigation.navigate('LotManagement')}
          />
          <ClickableRoundButton
            title="Nuevo Lote"
            iconName="home-plus"
            onPress={handleCreateLot}
          />
        </Surface>
        <TodaysLots />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    padding: 16,
  },
  homeElements: {
    flex: 1,
    marginHorizontal: 2,
  },
  surfaceTopRoundButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribute buttons evenly
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 8,
    elevation: 4,
    borderRadius: 12,
    backgroundColor: 'white',
    marginBottom: 12,
  },
});

export default HomeScreen;
