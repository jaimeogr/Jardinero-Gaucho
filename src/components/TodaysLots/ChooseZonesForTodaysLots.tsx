import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { List } from 'react-native-paper';

import CustomAccordion from './CustomAccordion';
import DataService from '../../services/DataService';
import { theme } from '../../styles/styles';

const ChooseZonesForTodaysLots = () => {
  const zonesOptions = DataService.getZonesOptions();

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {zonesOptions.map((neighbourhood, neighbourhoodIndex) => (
          <CustomAccordion
            key={neighbourhoodIndex}
            title={neighbourhood.neighbourhood}
            level={0} // Neighbourhood level
            thisWeeksNormalLotsToMow={neighbourhood.needMowing}
            thisWeeksCriticalLotsToMow={neighbourhood.needMowing}
          >
            {neighbourhood.zones.map((zone, zoneIndex) => (
              <CustomAccordion
                key={zoneIndex}
                title={`Zona ${zone.zone}`}
                level={1} // Zone level
                thisWeeksNormalLotsToMow={zone.needMowing}
                thisWeeksCriticalLotsToMow={zone.needMowing}
              >
                {zone.lots.map((lot, lotIndex) => (
                  <List.Item
                    key={lotIndex}
                    titleStyle={{ fontWeight: 'bold' }}
                    title={`Lote ${lot.number}`}
                    description={`Ultima pasada: ${lot.lastMowingDate.toDateString()}`}
                    left={(props) => (
                      <List.Icon
                        {...props}
                        icon={false ? 'circle-slice-8' : 'circle-outline'}
                        color={theme.colors.primary}
                      />
                    )}
                    right={(props) => (
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
        colors={['transparent', 'rgba(255, 255, 255, 0.8)']}
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
    paddingHorizontal: 24,
  },
  fadeEffect: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 20,
    marginRight: 4,
  },
});

export default ChooseZonesForTodaysLots;
