import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const OrDivider = () => {
  return (
    <View style={styles.container}>
      {/* Left line */}
      <View style={styles.line} />

      {/* "or" text */}
      <Text style={styles.orText}>o</Text>

      {/* Right line */}
      <View style={styles.line} />
    </View>
  );
};

export default OrDivider;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row', // Place items side by side
    alignItems: 'center', // Vertically center
    marginVertical: 16, // Some vertical spacing
  },
  line: {
    flex: 1, // Fill all available horizontal space
    height: 1,
    backgroundColor: '#ccc', // Light gray line
  },
  orText: {
    marginHorizontal: 8, // Space on both sides of the text
    color: '#999', // Slightly darker gray text
    fontSize: 14,
  },
});
