import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, BackHandler } from 'react-native';
import { Appbar } from 'react-native-paper';

import CustomAccordion from './CustomAccordion';
import OneLotForCustomAccordion from './OneLotForCustomAccordion';
import ControllerService from '../../services/useControllerService';
import { useNestedLots } from '../../services/useLotService';
import useLotStore from '../../stores/useLotStore';
import { theme } from '../../styles/styles';

const { markSelectedLotsCompletedForSpecificDate } = ControllerService;

const upperIndicatorsAndButtonsColor = theme.colors.primary;

const NestedViewLots = () => {
  const { nestedLots, selectedLots } = useNestedLots();

  const deselectLots = useLotStore((state) => state.deselectAllLots);

  const handleDeselectLots = useCallback(() => {
    deselectLots(/* pass the necessary lotId here */);
  }, [deselectLots]);

  const handleMarkLotsCompleted = () => {
    const success = markSelectedLotsCompletedForSpecificDate();
    if (success) {
      console.log('Selected lots marked as completed');
      handleDeselectLots();
    } else {
      console.error('No lots were selected to mark as completed');
    }
  };

  // this will handle the Native OS back button press event
  useEffect(() => {
    const onBackPress = () => {
      handleDeselectLots();
      return true; // Return true to prevent the default back behavior
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      onBackPress,
    );
    return () => backHandler.remove(); // Cleanup the listener when the component unmounts
  }, [handleDeselectLots]);

  return (
    <View style={styles.container}>
      {/* when there are selected lots, it renders the buttons to interact with the selected lots
      otherwise, it renders the title
      */}
      {selectedLots ? (
        <View style={styles.upperSide}>
          <View style={styles.selectedIndicatorsTextAndButtons}>
            <View style={styles.selectedIndicatorsLeftSide}>
              <Appbar.BackAction
                color={upperIndicatorsAndButtonsColor}
                size={28}
                onPress={handleDeselectLots}
              />
              <Text style={styles.selectedIndicatorsText}>{selectedLots}</Text>
            </View>

            <View style={styles.selectedIndicatorsRightSide}>
              <Appbar.Action
                icon="check-circle-outline"
                color={upperIndicatorsAndButtonsColor}
                size={28}
                onPress={handleMarkLotsCompleted}
              />
              <Appbar.Action
                icon="account-arrow-left"
                color={upperIndicatorsAndButtonsColor}
                size={28}
                onPress={() => {}}
              />
              <Appbar.Action
                icon="dots-vertical"
                color={upperIndicatorsAndButtonsColor}
                size={28}
                onPress={() => {}}
              />
            </View>
          </View>
        </View>
      ) : (
        <Text style={styles.title}>Mis lotes</Text>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {nestedLots.map((neighbourhood, neighbourhoodIndex) => (
          <CustomAccordion
            key={neighbourhoodIndex}
            id={neighbourhood.neighbourhoodId}
            title={neighbourhood.neighbourhoodLabel}
            level={0} // Neighbourhood level
            thisWeeksNormalLotsToMow={neighbourhood.needMowing}
            thisWeeksCriticalLotsToMow={neighbourhood.needMowingCritically}
            isSelected={neighbourhood.isSelected}
          >
            {neighbourhood.zones.map((zone, zoneIndex) => (
              <CustomAccordion
                key={zoneIndex}
                id={zone.zoneId}
                title={`Zona ${zone.zoneLabel}`}
                level={1} // Zone level
                thisWeeksNormalLotsToMow={zone.needMowing}
                thisWeeksCriticalLotsToMow={zone.needMowingCritically}
                isSelected={zone.isSelected}
              >
                {zone.lots.map((lot, lotIndex) => (
                  <OneLotForCustomAccordion
                    key={lotIndex}
                    title={`Lote ${lot.lotLabel}`}
                    description={`Ultima pasada: ${lot.lastMowingDate.toDateString()}`}
                    lotId={lot.lotId}
                    isLastItem={lotIndex === zone.lots.length - 1}
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
  upperSide: {
    // alignSelf: 'flex-start',
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 24,
    alignSelf: 'flex-start',
    paddingTop: 12,
    marginLeft: 24,
    marginBottom: 12,
  },
  selectedIndicatorsTextAndButtons: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2,
    marginHorizontal: 10,
  },
  selectedIndicatorsText: {
    marginLeft: 8,
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  selectedIndicatorsLeftSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedIndicatorsRightSide: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 0,
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

export default NestedViewLots;
