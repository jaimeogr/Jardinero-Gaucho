import React from 'react';
import { StyleSheet, TouchableOpacity, View, Text } from 'react-native';
import { IconButton } from 'react-native-paper';

import { theme } from '@/styles/styles';

const ClickableRoundButton = ({ title, iconName, onPress }) => {
  const titleContent = title.split(' ').join('\n');

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7} style={styles.touchable}>
      <View style={styles.roundButton}>
        <IconButton icon={iconName} size={34} style={styles.icon} />

        <Text style={styles.text}>{titleContent}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchable: {
    // flex: 0, // Allows buttons to take equal space within parent container
  },
  roundButton: {
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    marginBottom: 5,
    backgroundColor: theme.colors.background2,
  },
  text: {
    fontSize: 14,
    textAlign: 'center',
  },
});

export default ClickableRoundButton;
