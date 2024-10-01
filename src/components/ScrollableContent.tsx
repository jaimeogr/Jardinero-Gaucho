// ScrollableContent.tsx
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient'; // Import from expo-linear-gradient
import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

import { theme } from '../styles/styles';

const ScrollableContent = () => {
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Add your scrollable content here */}
        <View style={styles.scrollItem}>
          <Text>Scrollable Item 1</Text>
          <MaterialCommunityIcons
            name="check-circle-outline"
            color={theme.colors.accent} // Use focused prop to set color explicitly
            size={28}
          />
        </View>
        <View style={styles.scrollItem}>
          <Text>Scrollable Item 2</Text>
          <MaterialCommunityIcons
            name="check-circle-outline"
            color="gray" // Use focused prop to set color explicitly
            size={28}
          />
        </View>
        <View style={styles.scrollItem}>
          <Text>Scrollable Item 3</Text>
          <MaterialCommunityIcons
            name="check-circle-outline"
            color="gray" // Use focused prop to set color explicitly
            size={28}
          />
        </View>
        <View style={styles.scrollItem}>
          <Text>Scrollable Item 4</Text>
          <MaterialCommunityIcons
            name="check-circle-outline"
            color="gray" // Use focused prop to set color explicitly
            size={28}
          />
        </View>
        <View style={styles.scrollItem}>
          <Text>Scrollable Item 5</Text>
          <MaterialCommunityIcons
            name="check-circle-outline"
            color="gray" // Use focused prop to set color explicitly
            size={28}
          />
        </View>
        <View style={styles.scrollItem}>
          <Text>Scrollable Item 6</Text>
          <MaterialCommunityIcons
            name="check-circle-outline"
            color="gray" // Use focused prop to set color explicitly
            size={28}
          />
        </View>
        <View style={styles.scrollItem}>
          <Text>Scrollable Item 7</Text>
          <MaterialCommunityIcons
            name="check-circle-outline"
            color="gray" // Use focused prop to set color explicitly
            size={28}
          />
        </View>
        <View style={styles.scrollItem}>
          <Text>Scrollable Item 8</Text>
          <MaterialCommunityIcons
            name="check-circle-outline"
            color="gray" // Use focused prop to set color explicitly
            size={28}
          />
        </View>
        <View style={styles.scrollItem}>
          <Text>Scrollable Item 9</Text>
          <MaterialCommunityIcons
            name="check-circle-outline"
            color="gray" // Use focused prop to set color explicitly
            size={28}
          />
        </View>
        <View style={styles.scrollItem}>
          <Text>Scrollable Item 10</Text>
          <MaterialCommunityIcons
            name="check-circle-outline"
            color="gray" // Use focused prop to set color explicitly
            size={28}
          />
        </View>
        <View style={styles.scrollItem}>
          <Text>Scrollable Item 11</Text>
          <MaterialCommunityIcons
            name="check-circle-outline"
            color="gray" // Use focused prop to set color explicitly
            size={28}
          />
        </View>
        <View style={styles.scrollItem}>
          <Text>Scrollable Item 12</Text>
          <MaterialCommunityIcons
            name="check-circle-outline"
            color="gray" // Use focused prop to set color explicitly
            size={28}
          />
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
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
