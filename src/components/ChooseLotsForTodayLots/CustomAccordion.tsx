import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { IconButton } from 'react-native-paper';

import { theme } from '../../styles/styles';

type CustomAccordionProps = {
  title: string;
  children: React.ReactNode;
  level: number; // Pass the level of accordion (neighbourhood or zone)
  thisWeeksNormalLotsToMow?: number;
  thisWeeksCriticalLotsToMow?: number;
  isSelected: boolean;
};

const CustomAccordion: React.FC<CustomAccordionProps> = ({
  title,
  children,
  level,
  thisWeeksNormalLotsToMow,
  thisWeeksCriticalLotsToMow,
  isSelected,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View
      style={
        level === 0
          ? styles.accordionContainerForNeighbourhood
          : styles.accordionContainerForZone
      }
    >
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={styles.accordionHeader}
      >
        <View style={styles.accordionHeaderLeftSide}>
          <TouchableOpacity
            onPress={() => console.log('Icon pressed')}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Increases pressable area without affecting visual size
          >
            <MaterialCommunityIcons
              name={isSelected ? 'circle-slice-8' : 'circle-outline'}
              color={theme.colors.primary}
              size={28}
            />
          </TouchableOpacity>
          <Text style={styles.accordionTitle}>{title}</Text>
        </View>

        <View style={styles.accordionHeaderRightSide}>
          {thisWeeksNormalLotsToMow ? (
            <View style={styles.accordionHeaderIndicatorNormal}>
              <Text>{thisWeeksNormalLotsToMow}</Text>
            </View>
          ) : null}
          {thisWeeksCriticalLotsToMow ? (
            <View style={styles.accordionHeaderIndicatorCritical}>
              <Text style={styles.accordionHeaderIndicatorText}>
                {thisWeeksCriticalLotsToMow}
              </Text>
            </View>
          ) : null}
          <IconButton
            icon={expanded ? 'chevron-up' : 'chevron-down'}
            size={20}
          />
        </View>
      </TouchableOpacity>

      {expanded && <View style={styles.accordionContent}>{children}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  accordionContainerForNeighbourhood: {
    marginBottom: 18,
    borderRadius: 10,
    borderColor: 'purple',
    borderWidth: 3,
    backgroundColor: '#FFE1FF',
  },
  accordionContainerForZone: {
    marginBottom: 18,
    borderRadius: 10,
    borderColor: '#347928',
    borderWidth: 3,
    backgroundColor: '#E7FBE6',
    paddingLeft: 6,
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 6,
  },
  accordionHeaderLeftSide: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  accordionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  accordionHeaderRightSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accordionHeaderIndicatorNormal: {},
  accordionHeaderIndicatorCritical: {
    marginLeft: 16,
    backgroundColor: 'orange',
    borderRadius: 16,
    padding: 7,
  },
  accordionHeaderIndicatorText: {
    fontWeight: 'bold',
  },
  accordionContent: {
    padding: 10,
  },
});

export default CustomAccordion;
