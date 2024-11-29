import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  BackHandler,
  FlatList,
} from 'react-native';
import { Appbar } from 'react-native-paper';

import CustomAccordion from './CustomAccordion';
import OneLotForCustomAccordion from './OneLotForCustomAccordion';
import useControllerService from '../../services/useControllerService';
import { theme } from '../../styles/styles';
import {
  NeighbourhoodData,
  ZoneData,
  NestedLotsWithIndicatorsInterface,
} from '../../types/types';

interface NestedViewLotsProps {
  title?: string;
  screen: string;
  handleDeselectLots: () => void;
  selectingStateRightSideActions?: React.ReactNode;
  renderRightSideForAccordion?: Function;
  renderRightSideForOneLot?: Function;
  hideLotsCounterAndTitle?: boolean;
  onlyZonesAreSelectable?: boolean;
  blockZoneExpansion?: boolean;
}

const NestedViewLots: React.FC<NestedViewLotsProps> = ({
  screen,
  title = 'Mis lotes',
  handleDeselectLots,
  selectingStateRightSideActions = null,
  renderRightSideForAccordion = null,
  renderRightSideForOneLot = null,
  hideLotsCounterAndTitle = null,
  onlyZonesAreSelectable = false,
  blockZoneExpansion = false,
}) => {
  const nestedLotsWithIndicatorsInterface: NestedLotsWithIndicatorsInterface | null =
    useControllerService.useNestedLots(screen);

  const { nestedLots, selectedLots } = nestedLotsWithIndicatorsInterface ?? {
    nestedLots: [],
    selectedLots: 0,
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

  const renderNeighbourhood = useCallback(
    ({ item: neighbourhood }) => {
      return (
        <CustomAccordion
          id={neighbourhood.neighbourhoodId}
          element={neighbourhood}
          level={0}
          title={neighbourhood.neighbourhoodLabel}
          isSelected={neighbourhood.isSelected}
          isSelectable={!onlyZonesAreSelectable}
          isExpanded={neighbourhood.isExpanded}
          renderRightSide={renderRightSideForAccordion}
        >
          {/* Zones */}
          {neighbourhood.zones.map((zone) => (
            <CustomAccordion
              id={zone.zoneId}
              key={zone.zoneId}
              level={1}
              element={zone}
              title={`Zona ${zone.zoneLabel}`}
              isSelected={zone.isSelected}
              isExpanded={zone.isExpanded}
              blockExpansion={blockZoneExpansion}
              renderRightSide={renderRightSideForAccordion}
            >
              {/* Lots */}
              {zone.lots.map((lot) => (
                <OneLotForCustomAccordion
                  key={lot.lotId}
                  lotId={lot.lotId}
                  isLastItem={false}
                  isSelectable={!onlyZonesAreSelectable}
                  renderRightSide={renderRightSideForOneLot}
                />
              ))}
            </CustomAccordion>
          ))}
        </CustomAccordion>
      );
    },
    [
      nestedLotsWithIndicatorsInterface,
      renderRightSideForAccordion,
      renderRightSideForOneLot,
      onlyZonesAreSelectable,
      blockZoneExpansion,
    ],
  );

  if (nestedLotsWithIndicatorsInterface === null) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Contenido no disponible</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* when there are selected lots, it renders the buttons to interact with the selected lots
      otherwise, it renders the title. Except if hideLotsCounterAndTitle is true.
      */}
      {hideLotsCounterAndTitle ? null : selectedLots ? (
        <View style={styles.upperSide}>
          <View style={styles.selectedIndicatorsTextAndButtons}>
            <View style={styles.selectingStateLeftSideCounter}>
              <Appbar.BackAction
                color={theme.colors.primary}
                size={28}
                onPress={handleDeselectLots}
              />
              <Text style={styles.selectedIndicatorsText}>
                {selectedLots}
                {'   '}lotes
              </Text>
            </View>

            {/* Conditionally render right-side actions if provided */}
            {selectingStateRightSideActions && (
              <View style={styles.selectingStateRightSideActions}>
                {selectingStateRightSideActions}
              </View>
            )}
          </View>
        </View>
      ) : (
        <Text style={styles.title}>{title}</Text>
      )}

      <FlatList
        data={nestedLots}
        keyExtractor={(item) => item.neighbourhoodId}
        renderItem={renderNeighbourhood}
        contentContainerStyle={styles.scrollContent}
      />
      <LinearGradient
        colors={['transparent', 'rgba(255, 255, 255, 0.9)']}
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
    paddingTop: 16,
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
  selectingStateLeftSideCounter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectingStateRightSideActions: {
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
    height: 36,
    marginRight: 4,
  },
});

export default NestedViewLots;
