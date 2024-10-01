// ScrollableContent.tsx
import { LinearGradient } from 'expo-linear-gradient'; // Import from expo-linear-gradient
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ScrollableContent = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Add your scrollable content here */}
        <View style={styles.scrollItem}>
          <Text>Scrollable Item 1</Text>
        </View>
        <View style={styles.scrollItem}>
          <Text>Scrollable Item 2</Text>
        </View>
        <View style={styles.scrollItem}>
          <Text>Scrollable Item 3</Text>
        </View>
        <View style={styles.scrollItem}>
          <Text>Scrollable Item 4</Text>
        </View>
        <View style={styles.scrollItem}>
          <Text>Scrollable Item 5</Text>
        </View>
        <View style={styles.scrollItem}>
          <Text>Scrollable Item 6</Text>
        </View>
        <View style={styles.scrollItem}>
          <Text>Scrollable Item 7</Text>
        </View>
        <View style={styles.scrollItem}>
          <Text>Scrollable Item 8</Text>
        </View>
        <View style={styles.scrollItem}>
          <Text>Scrollable Item 9</Text>
        </View>
        <View style={styles.scrollItem}>
          <Text>Scrollable Item 10</Text>
        </View>
        <View style={styles.scrollItem}>
          <Text>Scrollable Item 11</Text>
        </View>
        <View style={styles.scrollItem}>
          <Text>Scrollable Item 12</Text>
        </View>
        {/* You can add more items as needed */}
      </ScrollView>

      {/* Fade effect at the bottom */}
      <LinearGradient
        colors={['transparent', 'rgba(255, 255, 255, 0.8)']} // Adjust colors for the fade effect
        style={styles.fadeEffect}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 10, // Padding for the scrollable area
    paddingHorizontal: 24, // Padding for the scrollable area
  },
  scrollItem: {
    padding: 16,
    marginVertical: 7,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
  },
  fadeEffect: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 40, // Adjust the height of the fade effect
  },
});

export default ScrollableContent;
