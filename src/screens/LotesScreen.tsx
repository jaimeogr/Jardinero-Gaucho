import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const LotesScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Lotes Screen</Text>
      {/* Add your screen content here */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default LotesScreen;
