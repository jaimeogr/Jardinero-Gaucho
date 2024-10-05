import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { IconButton } from 'react-native-paper';

import { theme } from '../../styles/styles';

const CustomAccordion = ({
  title,
  children,
  styleAccordionContainer,
  styleAccordionHeader,
  styleAccordionTitle,
  thisWeeksNormalLotsToMow,
  thisWeeksCriticalLotsToMow,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styleAccordionContainer}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={styleAccordionHeader}
      >
        <MaterialCommunityIcons
          name={true ? 'circle-slice-8' : 'circle-outline'}
          color={theme.colors.primary}
          size={28}
        />
        <Text style={styleAccordionTitle}>{title}</Text>
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
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24, // Padding for the scrollable area
  },
  fadeEffect: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 20, // Adjust the height of the fade effect
    marginRight: 4, // Padding to match the scrollable area
  },
  accordionContainerForNeighbourhood: {
    marginBottom: 18,
    borderRadius: 10,
    borderColor: 'purple',
    borderWidth: 3,
    backgroundColor: '#FFE1FF',
  },
  accordionHeaderForNeighbourhood: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 14,
  },
  accordionTitleForNeighbourhood: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  accordionContainerForZone: {
    marginBottom: 18,
    borderRadius: 10,
    borderColor: '#347928',
    borderWidth: 3,
    backgroundColor: '#E7FBE6',
  },
  accordionHeaderForZone: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingLeft: 14,
  },
  accordionTitleForZone: {
    fontSize: 17,
    fontWeight: 'bold',
  },
  accordionContent: {
    padding: 10,
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
});

export default CustomAccordion;
