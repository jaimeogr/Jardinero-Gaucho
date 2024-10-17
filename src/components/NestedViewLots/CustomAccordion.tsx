import { MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { IconButton } from 'react-native-paper';

import useLotStore from '../../stores/useLotStore';
import { theme } from '../../styles/styles';

const {
  accordion: {
    // neighbourhood not selected
    neighbourhoodAccordionBorderNotSelected,
    neighbourhoodAccordionBackgroundNotSelected,
    // neighbourhood selected
    neighbourhoodAccordionBorderSelected,
    neighbourhoodAccordionBackgroundSelected,
    // neighbourhood not selected
    zoneAccordionBorderNotSelected,
    zoneAccordionBackgroundNotSelected,
    // neighbourhood selected
    zoneAccordionBorderSelected,
    zoneAccordionBackgroundSelected,
  },
} = theme.colors;

type CustomAccordionProps = {
  id: string;
  title: string;
  children: React.ReactNode;
  level: number; // Pass the level of accordion (neighbourhood or zone)
  thisWeeksNormalLotsToMow?: number;
  thisWeeksCriticalLotsToMow?: number;
  isSelected: boolean;
};

const CustomAccordion: React.FC<CustomAccordionProps> = ({
  id,
  title,
  children,
  level,
  thisWeeksNormalLotsToMow,
  thisWeeksCriticalLotsToMow,
  isSelected,
}) => {
  const [expanded, setExpanded] = useState(false);

  const toogleIsSelected = useLotStore((state) =>
    level === 0
      ? state.toggleNeighbourhoodSelection
      : state.toggleZoneSelection,
  );

  // Wrap the toggle function with useCallback to avoid creating a new function on each render
  const handleToggle = useCallback(() => {
    toogleIsSelected(id, !isSelected);
  }, [toogleIsSelected, id, isSelected]);

  return (
    <View
      style={[
        level === 0
          ? styles.accordionContainerForNeighbourhood
          : styles.accordionContainerForZone,
        isSelected && level === 0
          ? styles.accordionContainterIsSelectedForNeighbourhood
          : null,
        isSelected && level === 1
          ? styles.accordionContainterIsSelectedForZone
          : null,
      ]}
    >
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={styles.accordionHeader}
      >
        <View style={styles.accordionHeaderLeftSide}>
          <TouchableOpacity
            onPress={handleToggle}
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
    borderColor: neighbourhoodAccordionBorderNotSelected,
    borderWidth: 3,
    backgroundColor: neighbourhoodAccordionBackgroundNotSelected,
  },
  accordionContainterIsSelectedForNeighbourhood: {
    backgroundColor: neighbourhoodAccordionBackgroundSelected,
    borderColor: neighbourhoodAccordionBorderSelected,
  },
  accordionContainerForZone: {
    marginBottom: 18,
    borderRadius: 10,
    borderColor: zoneAccordionBorderNotSelected,
    borderWidth: 3,
    backgroundColor: zoneAccordionBackgroundNotSelected,
    paddingLeft: 6,
  },
  accordionContainterIsSelectedForZone: {
    backgroundColor: zoneAccordionBackgroundSelected,
    borderColor: zoneAccordionBorderSelected,
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
