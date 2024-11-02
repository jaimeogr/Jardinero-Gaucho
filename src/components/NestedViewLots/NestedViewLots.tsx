import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Text, BackHandler } from 'react-native';
import { Appbar } from 'react-native-paper';

import CustomAccordion from './CustomAccordion';
import OneLotForCustomAccordion from './OneLotForCustomAccordion';
import { useNestedLots } from '../../services/useLotService';
import { theme } from '../../styles/styles';

interface NestedViewLotsProps {
  selectingStateRightSideActions?: React.ReactNode;
  handleDeselectLots: () => void;
  renderRightSideForAccordion: Function;
  renderRightSideForOneLot: Function;
  onlyZonesAreSelectable?: boolean;
  expandNeighbourhood?: boolean;
}

const NestedViewLots: React.FC<NestedViewLotsProps> = ({
  selectingStateRightSideActions = null,
  handleDeselectLots,
  renderRightSideForAccordion,
  renderRightSideForOneLot,
  onlyZonesAreSelectable = false,
  expandNeighbourhood = false,
}) => {
  const { nestedLots, selectedLots } = useNestedLots();

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
        <Text style={styles.title}>Mis lotes</Text>
      )}

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {nestedLots.map((neighbourhood, neighbourhoodIndex) => (
          <CustomAccordion
            key={neighbourhoodIndex}
            id={neighbourhood.neighbourhoodId}
            element={neighbourhood}
            title={neighbourhood.neighbourhoodLabel}
            level={0} // Neighbourhood level
            renderRightSide={renderRightSideForAccordion}
            isSelected={neighbourhood.isSelected}
            isSelectable={!onlyZonesAreSelectable}
            startExpanded={expandNeighbourhood}
          >
            {neighbourhood.zones.map((zone, zoneIndex) => (
              <CustomAccordion
                key={zoneIndex}
                id={zone.zoneId}
                element={zone}
                title={`Zona: ${zone.zoneLabel}`}
                level={1} // Zone level
                isSelected={zone.isSelected}
                renderRightSide={renderRightSideForAccordion}
              >
                {zone.lots.map((lot, lotIndex) => (
                  <OneLotForCustomAccordion
                    key={lotIndex}
                    lotId={lot.lotId}
                    isLastItem={lotIndex === zone.lots.length - 1}
                    isSelectable={!onlyZonesAreSelectable}
                    renderRightSide={renderRightSideForOneLot}
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
    height: 20,
    marginRight: 4,
  },
});

export default NestedViewLots;
