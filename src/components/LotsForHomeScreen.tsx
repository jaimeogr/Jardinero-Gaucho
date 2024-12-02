import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { Surface, Appbar } from 'react-native-paper';

import NestedViewLots from './NestedViewLots/NestedViewLots';
import useControllerService from '../services/useControllerService';
import { theme } from '../styles/styles';
import {
  LotWithNeedMowingInterface,
  ZoneWithIndicatorsInterface,
  NeighbourhoodWithIndicatorsInterface,
} from '../types/types';

const screenCodeForGlobalState = 'homeScreen';

const LotsForHomeScreen = () => {
  const {
    markSelectedLotsCompletedForSpecificDate,
    deselectAllLots,
    collapseAllNeighbourhoods,
    collapseAllZones,
  } = useControllerService;

  useEffect(() => {
    collapseAllNeighbourhoods();
    collapseAllZones();
  }, [collapseAllNeighbourhoods, collapseAllZones]);

  const handleDeselectLots = useCallback(() => {
    deselectAllLots(screenCodeForGlobalState);
  }, [deselectAllLots]);

  const handleMarkLotsCompleted = () => {
    const success = markSelectedLotsCompletedForSpecificDate();
    if (success) {
      console.log('Selected lots marked as completed');
      handleDeselectLots();
    } else {
      console.error('No lots were selected to mark as completed');
    }
  };

  const renderRightSideForOneLot = useCallback(
    (lot: LotWithNeedMowingInterface) => {
      if (lot) {
        return (
          <TouchableOpacity style={{ paddingHorizontal: 10 }}>
            <Icon name="clock-outline" size={28} color="orange" />
          </TouchableOpacity>
        );
      } else {
        return null;
      }
    },
    [],
  );

  const renderRightSideForAccordion = useCallback(
    (
      element:
        | ZoneWithIndicatorsInterface
        | NeighbourhoodWithIndicatorsInterface,
    ) => {
      if (element) {
        return (
          <View style={styles.indicatorsContainer}>
            {element.needMowingCritically ? (
              <View
                style={[
                  styles.accordionHeaderIndicator,
                  styles.accordionHeaderIndicatorCritical,
                ]}
              >
                <Text style={styles.accordionHeaderIndicatorText}>
                  {element.needMowingCritically}
                </Text>
              </View>
            ) : null}
            {element.needMowing ? (
              <View
                style={[
                  styles.accordionHeaderIndicator,
                  styles.accordionHeaderIndicatorNormal,
                ]}
              >
                <Text style={styles.accordionHeaderIndicatorText}>
                  {element.needMowing}
                </Text>
              </View>
            ) : null}
          </View>
        );
      } else {
        return null;
      }
    },
    [],
  );

  const selectingStateRightSideActions = (
    <>
      <Appbar.Action
        icon="check-circle-outline"
        color={theme.colors.primary}
        size={28}
        onPress={handleMarkLotsCompleted}
      />
      <Appbar.Action
        icon="account-arrow-left"
        color={theme.colors.primary}
        size={28}
        onPress={() => {}}
      />
      <Appbar.Action
        icon="dots-vertical"
        color={theme.colors.primary}
        size={28}
        onPress={() => {}}
      />
    </>
  );

  return (
    <Surface style={styles.surface}>
      <View style={styles.content}>
        <NestedViewLots
          screen={screenCodeForGlobalState}
          selectingStateRightSideActions={selectingStateRightSideActions}
          handleDeselectLots={handleDeselectLots}
          renderRightSideForAccordion={renderRightSideForAccordion}
          renderRightSideForOneLot={renderRightSideForOneLot}
        />
      </View>
    </Surface>
  );
};

const styles = StyleSheet.create({
  surface: {
    flex: 1,
    elevation: 4, // Elevation to create a shadow effect
    borderRadius: 12, // Rounded corners for a modern look
    backgroundColor: 'white', // Background color for the surface
    flexDirection: 'column', // Layout with icon and text side by side
    alignItems: 'center', // Center the content vertically
    overflow: 'hidden',
  },
  content: {
    flex: 1,
    width: '100%',
    justifyContent: 'space-between',
  },
  indicatorsContainer: {
    marginLeft: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  accordionHeaderIndicator: {
    marginLeft: 6,
    borderRadius: 16,
    padding: 7,
  },
  accordionHeaderIndicatorNormal: {
    backgroundColor: theme.colors.lightBrown,
  },
  accordionHeaderIndicatorCritical: {
    backgroundColor: 'orange',
  },
  accordionHeaderIndicatorText: {
    fontWeight: 'bold',
  },
});
export default LotsForHomeScreen;
