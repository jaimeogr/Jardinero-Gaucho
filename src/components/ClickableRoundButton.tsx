import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, IconButton } from 'react-native-paper';

import { theme } from '../styles/styles';

const ClickableRoundButton = ({ title, iconName, onPress }) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.7}
      style={styles.touchable}
    >
      <View style={styles.roundButton}>
        <IconButton icon={iconName} size={32} style={styles.icon} />
        <Text style={styles.text}>{title}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    flex: 1, // Allows buttons to take equal space within parent container
    maxWidth: 110, // Set a max width to prevent the button from being too wide
  },
  roundButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 16,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 4,
    backgroundColor: theme.colors.background2,
  },
  text: {
    fontSize: 14,
    fontWeight: 'normal',
    textAlign: 'center',
  },
});

export default ClickableRoundButton;
