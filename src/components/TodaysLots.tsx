import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';

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
      <Card.Actions>
        <Button>Cancel</Button>
        <Button>Ok</Button>
      </Card.Actions>
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
    alignItems: 'flex-start', // Align the title to the start (left)
    paddingHorizontal: 8, // Optional padding to prevent text from sticking to the border
    paddingTop: 8, // Optional padding to control spacing from the top
  },
  cardTitle: {
    fontSize: 24, // Customize the font size if needed
  },
});

export default TodaysLots;
