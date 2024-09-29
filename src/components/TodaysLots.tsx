import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Button } from 'react-native-paper';

const TodaysLots = () => {
  return (
    <Card style={styles.todaysLots}>
      <Card.Title title="Card Title" subtitle="Card Subtitle" />
      <Card.Content>
        <Text variant="titleLarge">Lotes de hoy</Text>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default TodaysLots;
