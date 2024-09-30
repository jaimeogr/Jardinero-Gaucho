import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Divider, Card, Text, Button } from 'react-native-paper';

const TodaysLots = () => {
  return (
    <Card style={styles.todaysLots}>
      <Card.Title
        title="Lotes de hoy"
        titleStyle={styles.cardTitle}
        style={styles.cardTitleContainer}
      />
      <Card.Content>
        <Text>Lotes de hoy contenido</Text>
      </Card.Content>
      <View style={styles.bottomElements}>
        <Card.Actions style={styles.bottomElements}>
          <Button>Administrar los Lotes de Hoy</Button>
        </Card.Actions>
        <Divider bold={true} horizontalInset={true} />
        <View style={styles.allIndicators}>
          <View style={styles.indicator}>
            <Text style={styles.indicatorTitle}>Lotes Faltantes</Text>
            <Text style={styles.indicatorNumber}>3</Text>
          </View>
          <View style={styles.indicator}>
            <Text style={styles.indicatorTitle}>Lotes Completados</Text>
            <Text style={styles.indicatorNumber}>5</Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  todaysLots: {
    flex: 1,
    marginBottom: 16,
    padding: 0,
  },
  cardTitleContainer: {
    alignItems: 'flex-start',
    paddingHorizontal: 8,
    paddingTop: 8,
  },
  cardTitle: {
    fontSize: 24,
  },
  bottomElements: {
    padding: 16, // Add some padding for the bottom elements
  },
  cardActions: {
    justifyContent: 'center', // Center the button within its container
  },
  centerButton: {
    alignSelf: 'center', // Center the button
  },
  allIndicators: {
    flexDirection: 'row', // Align indicators horizontally
    justifyContent: 'space-between', // Evenly distribute space
    marginTop: 8, // Add some spacing above the indicators
  },
  indicator: {
    flex: 1, // Make each indicator take equal space
    alignItems: 'center', // Center the text within the indicator
  },
  indicatorTitle: {
    fontSize: 16,
  },
  indicatorNumber: {
    fontSize: 16,
  },
});
export default TodaysLots;
