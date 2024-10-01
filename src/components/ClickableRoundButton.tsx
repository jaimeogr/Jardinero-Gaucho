import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, IconButton } from 'react-native-paper';

import { theme } from '../styles/styles';

const ClickableRoundButton = ({ title, iconName, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={{ flex: 1 }}>
      <View style={styles.roundButton}>
        <IconButton icon={iconName} size={32} style={styles.icon} />
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  roundButton: {
    paddingTop: 4,
    paddingBottom: 12,
    borderRadius: 16, // Rounded corners for a modern look
    backgroundColor: 'white', // Background color for the surface
    flexDirection: 'column', // Layout with icon and text side by side
    alignItems: 'center', // Center the content vertically
  },
  icon: {
    backgroundColor: theme.colors.background2,
  },
  text: {
    fontSize: 16,
    fontWeight: 'normal',
  },
});

export default ClickableRoundButton;
