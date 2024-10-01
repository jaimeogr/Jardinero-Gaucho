import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Surface, Text, IconButton } from 'react-native-paper';

const ClickableSurface = ({ title, iconName, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ flex: 1 }}>
      <Surface style={styles.surface}>
        <IconButton icon={iconName} size={32} style={styles.icon} />
        <Text style={styles.text}>{title}</Text>
      </Surface>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  surface: {
    padding: 12,
    elevation: 4, // Elevation to create a shadow effect
    borderRadius: 16, // Rounded corners for a modern look
    backgroundColor: 'white', // Background color for the surface
    flexDirection: 'column', // Layout with icon and text side by side
    alignItems: 'center', // Center the content vertically
  },
  icon: {
    marginRight: 8, // Space between the icon and text
  },
  text: {
    fontSize: 16,
    fontWeight: 'medium',
  },
});

export default ClickableSurface;
