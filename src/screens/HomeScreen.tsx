// src/screens/HomeScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import ClickableSurface from '../components/ClickableSurface';
import TodaysLots from '../components/TodaysLots';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TodaysLots />
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
    justifyContent: 'center',
    margin: 16,
  },
  button: {
    marginTop: 16,
  },
  twoSurfaces: {
    flexDirection: 'row',
  },
});
export default HomeScreen;
