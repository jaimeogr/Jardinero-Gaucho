// src/screens/HomeScreen.js
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';

import TodaysLots from '../components/TodaysLots';

const HomeScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <TodaysLots />
      <Button
        style={styles.button}
        mode="contained"
        onPress={() => navigation.navigate('LotManagement')}
      >
        Go to Lot Management
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  button: {
    marginTop: 16,
  },
});
export default HomeScreen;
