import React, { useEffect, useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import { Surface, Appbar } from 'react-native-paper';

import NestedViewLots from './NestedViewLots/NestedViewLots';
import useControllerService from '../services/useControllerService';
import { theme } from '../styles/styles';

const LotsOnSurfaceForHomeScreen = () => {
  const { markSelectedLotsCompletedForSpecificDate, deselectAllLots } =
    useControllerService;

  const handleDeselectLots = useCallback(() => {
    deselectAllLots();
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
          selectingStateRightSideActions={selectingStateRightSideActions}
          handleDeselectLots={handleDeselectLots}
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
});
export default LotsOnSurfaceForHomeScreen;
