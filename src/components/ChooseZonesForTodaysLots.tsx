import { LinearGradient } from 'expo-linear-gradient'; // Import from expo-linear-gradient
import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Text,
} from 'react-native';
import { List, IconButton } from 'react-native-paper';

import DataService from '../services/DataService';

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
        <Text style={styleAccordionTitle}>{title}</Text>
        <View style={styles.accordionHeaderRightSide}>
          {thisWeeksNormalLotsToMow ? (
            <View>
              <Text>{thisWeeksNormalLotsToMow}</Text>
            </View>
          ) : null}
          {thisWeeksCriticalLotsToMow ? (
            <View>
              <Text>{thisWeeksCriticalLotsToMow}</Text>
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

const ChooseZonesForTodaysLots = () => {
  const zonesOptions = DataService.getZonesOptions();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {zonesOptions.map((neighbourhood, neighbourhoodIndex) => (
          <CustomAccordion
            key={neighbourhoodIndex}
            title={`${neighbourhood.neighbourhood}`}
            styleAccordionContainer={styles.accordionContainerForNeighbourhood}
            styleAccordionHeader={styles.accordionHeaderForNeighbourhood}
            styleAccordionTitle={styles.accordionTitleForNeighbourhood}
            thisWeeksNormalLotsToMow={neighbourhood.needMowing}
            thisWeeksCriticalLotsToMow={neighbourhood.needMowing}
          >
            {neighbourhood.zones.map((zone, zoneIndex) => (
              <CustomAccordion
                key={zoneIndex}
                title={`Zona ${zone.zone}`}
                styleAccordionContainer={styles.accordionContainerForZone}
                styleAccordionHeader={styles.accordionHeaderForZone}
                styleAccordionTitle={styles.accordionTitleForZone}
                thisWeeksNormalLotsToMow={zone.needMowing}
                thisWeeksCriticalLotsToMow={zone.needMowing}
              >
                {zone.lots.map((lot, lotIndex) => (
                  <List.Item
                    key={lotIndex}
                    title={`Lot ${lot.number}`}
                    description={`Last mowed: ${lot.lastMowingDate.toDateString()}`}
                    left={(props) => (
                      <List.Icon
                        {...props}
                        icon={lot.needMowing ? 'alert' : 'check'}
                        color={lot.needMowing ? 'red' : 'green'}
                      />
                    )}
                  />
                ))}
              </CustomAccordion>
            ))}
          </CustomAccordion>
        ))}
      </ScrollView>
      <LinearGradient
        colors={['transparent', 'rgba(255, 255, 255, 0.8)']} // Adjust colors for the fade effect
        style={styles.fadeEffect}
      />
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
});

export default ChooseZonesForTodaysLots;
