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
import { theme } from '../styles/styles';

const CustomAccordion = ({
  title,
  children,
  styleAccordionContainer,
  styleAccordionHeader,
  styleAccordionTitle,
}) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styleAccordionContainer}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={styleAccordionHeader}
      >
        <Text style={styleAccordionTitle}>{title}</Text>
        <IconButton icon={expanded ? 'chevron-up' : 'chevron-down'} size={20} />
      </TouchableOpacity>
      {expanded && <View style={styles.accordionContent}>{children}</View>}
    </View>
  );
};

const ChooseZonesForTodaysLots = () => {
  const zonesOptions = DataService.getZonesOptions();

  return (
    <ScrollView contentContainerStyle={styles.scrollContent}>
      {zonesOptions.map((neighbourhood, neighbourhoodIndex) => (
        <CustomAccordion
          key={neighbourhoodIndex}
          title={`${neighbourhood.neighbourhood}`}
          styleAccordionContainer={styles.accordionContainerForNeighbourhood}
          styleAccordionHeader={styles.accordionHeaderForNeighbourhood}
          styleAccordionTitle={styles.accordionTitleForNeighbourhood}
        >
          {neighbourhood.zones.map((zone, zoneIndex) => (
            <CustomAccordion
              key={zoneIndex}
              title={`Zone ${zone.zone} - ${zone.needMowing} lots need mowing`}
              styleAccordionContainer={styles.accordionContainerForZone}
              styleAccordionHeader={styles.accordionHeaderForZone}
              styleAccordionTitle={styles.accordionTitleForZone}
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
      <LinearGradient
        colors={['transparent', 'rgba(255, 255, 255, 0.8)']} // Adjust colors for the fade effect
        style={styles.fadeEffect}
      />
    </ScrollView>
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
    backgroundColor: '#EEEEEE',
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
    borderColor: theme.colors.accent2,
    borderWidth: 3,
    backgroundColor: '#EEEEEE',
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
});

export default ChooseZonesForTodaysLots;
