import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Divider } from 'react-native-paper';

import { theme } from '../../styles/styles';

const OneLotForCustomAccordion = ({ title, description, lot }) => {
  return (
    <View style={styles.containerWithDivider}>
      <TouchableOpacity style={styles.container}>
        {/* Left Icon */}
        <TouchableOpacity
          onPress={() => console.log('Icon pressed')}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Increases pressable area without affecting visual size
        >
          <MaterialCommunityIcons
            name={true ? 'circle-slice-8' : 'circle-outline'}
            color={theme.colors.primary}
            size={28}
          />
        </TouchableOpacity>

        {/* Title and Description */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
        </View>

        {/* Right Icon */}
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
  containerWithDivider: {},
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
  divider: {
    width: '95%',
    backgroundColor: 'lightgray',
    // marginRight: 10,
    // marginLeft: 12,
    alignSelf: 'center',
  },
});

export default OneLotForCustomAccordion;
