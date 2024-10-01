import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Surface, Text, IconButton } from 'react-native-paper';

const ClickableSurface = ({ title, iconName, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ flex: 1 }}>
      <Surface style={styles.surface}>
        <IconButton icon={iconName} size={28} style={styles.icon} />
        <Text style={styles.text}>{title}</Text>
      </Surface>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  surface: {
    paddingTop: 4,
    paddingBottom: 12,
    elevation: 4, // Elevation to create a shadow effect
    borderRadius: 16, // Rounded corners for a modern look
    backgroundColor: 'white', // Background color for the surface
    flexDirection: 'column', // Layout with icon and text side by side
    alignItems: 'center', // Center the content vertically
  },
  icon: {},
  text: {
    fontSize: 16,
    fontWeight: 'normal',
  },
});

export default ClickableSurface;
