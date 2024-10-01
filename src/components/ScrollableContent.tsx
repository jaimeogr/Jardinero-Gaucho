// ScrollableContent.tsx
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

const ScrollableContent = () => {
  return (
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
  );
};

const styles = StyleSheet.create({
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
});

export default ScrollableContent;
