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
      style={styles.gradient} // Apply the gradient to the entire container
      start={{ x: 0.5, y: 0.4 }} // Start the gradient from the top center
      end={{ x: 0.5, y: 0.6 }} // End the gradient at the bottom center
    >
      <View style={styles.allHomeElements}>
        <Surface style={styles.surfaceTopRoundButtons}>
          <ClickableRoundButton
            title="Ingresar Cobro"
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
            onPress={() => navigation.navigate('LotManagement')}
          />
        </Surface>
        <TodaysLots style={{ flex: 1 }} />
      </View>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
    padding: 16,
  },
  allHomeElements: {
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
    borderRadius: 16,
    backgroundColor: 'white',
    marginBottom: 12,
  },
});

export default HomeScreen;
