import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-paper';

import { theme } from '../../styles/styles';

const OneLotForCustomAccordion = ({ title, description, lot }) => {
  const [isSelected, setSelected] = useState(false);

  return (
    <View>
      <TouchableOpacity
        style={
          isSelected
            ? [styles.container, styles.lotIsSelected]
            : styles.container
        }
      >
        {/* Left Icon */}
        <TouchableOpacity
          onPress={() => setSelected(!isSelected)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Increases pressable area without affecting visual size
        >
          <MaterialCommunityIcons
            name={isSelected ? 'circle-slice-8' : 'circle-outline'}
            color={theme.colors.primary}
            size={28}
          />
        </TouchableOpacity>

        {/* Title and Description */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {/* Right Side */}
        <TouchableOpacity style={styles.rightIconContainer}>
          <MaterialCommunityIcons
            name="clock-outline"
            size={28}
            color="orange"
          />
        </TouchableOpacity>
      </TouchableOpacity>
      <Divider style={styles.divider} bold={true} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    marginVertical: 8,
  },
  leftIconContainer: {
    paddingHorizontal: 10,
  },
  textContainer: {
    flex: 1,
    marginLeft: 10,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  description: {
    color: '#888',
    fontSize: 14,
  },
  rightIconContainer: {
    paddingHorizontal: 10,
  },
  lotIsSelected: {
    backgroundColor: '#e0f7fa', // Light blue for selected items across all levels
    borderColor: '#00796b', // Optional border for emphasis
    borderWidth: 1,
    borderRadius: 10,
  },
  divider: {
    width: '95%',
    backgroundColor: 'lightgray',
    alignSelf: 'center',
  },
});

export default OneLotForCustomAccordion;
