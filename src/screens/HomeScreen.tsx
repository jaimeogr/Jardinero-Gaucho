// src/screens/HomeScreen.js
import { LinearGradient } from 'expo-linear-gradient'; // Import LinearGradient from expo-linear-gradient
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface } from 'react-native-paper';

import ClickableRoundButton from '../components/ClickableRoundButton';
import TodaysLots from '../components/TodaysLots';
import { theme } from '../styles/styles';

const HomeScreen = ({ navigation }) => {
  return (
    <LinearGradient
      colors={[theme.colors.background, theme.colors.background2]} // Define the gradient colors
      style={styles.container} // Apply the gradient to the entire container
      start={{ x: 0.5, y: 0.2 }} // Start the gradient from the top center
      end={{ x: 0.5, y: 0.5 }} // End the gradient at the bottom center
    >
      <Surface style={styles.surfaceTopRoundButtons}>
        <ClickableRoundButton
          title="Administrar Lotes"
          iconName="home-group"
          onPress={() => navigation.navigate('LotManagement')}
        />
        <ClickableRoundButton
          title="Nuevo Lote"
          iconName="home-plus"
          onPress={() => navigation.navigate('LotManagement')}
        />
      </Surface>
      <TodaysLots style={{ flex: 1 }} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  button: {
    marginTop: 16,
  },
  surfaceTopRoundButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16, // Adds space between each surface (requires React Native 0.70 or above)
    elevation: 4, // Elevation to create a shadow effect
    borderRadius: 16, // Rounded corners for a modern look
    backgroundColor: 'white', // Background color for the surface
    alignItems: 'center', // Center the content vertically
    marginBottom: 12,
  },
  surface: {},
});

export default HomeScreen;
