// src/screens/HomeScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';

import ClickableSurface from '../components/ClickableSurface';
import TodaysLots from '../components/TodaysLots';
import { theme } from '../styles/styles';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TodaysLots style={{ flex: 1 }} />
      <View style={styles.twoSurfaces}>
        <ClickableSurface
          title="Administrar Lotes"
          iconName="home-group"
          onPress={() => navigation.navigate('LotManagement')}
        />
        <ClickableSurface
          title="Nuevo Lote"
          iconName="home-plus"
          onPress={() => navigation.navigate('LotManagement')}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // margin: 16,
    padding: 16,
    backgroundColor: theme.colors.background,
  },
  button: {
    marginTop: 16,
  },
  twoSurfaces: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16, // Adds space between each surface (requires React Native 0.70 or above)
    paddingVertical: 8,
  },
});
export default HomeScreen;
