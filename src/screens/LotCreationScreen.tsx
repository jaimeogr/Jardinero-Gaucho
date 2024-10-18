import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  ScrollView,
} from 'react-native';
import { v4 as uuidv4 } from 'uuid'; //ID Generator

import useControllerService from '../services/useControllerService';

const { createLot } = useControllerService;

const LotCreationScreen = ({ navigation }) => {
  const [lotData, setLotData] = useState({
    lotLabel: '',
    zoneLabel: '',
    neighbourhoodLabel: '',
    lastMowingDate: new Date(),
    extraNotes: '',
  });

  const handleInputChange = (field, value) => {
    setLotData({ ...lotData, [field]: value });
  };

  const handleSubmit = () => {
    const newLot = {
      ...lotData,
      lotId: uuidv4(), // Implement or import a UUID generator
      zoneId: uuidv4(),
      neighbourhoodId: uuidv4(),
      lotIsSelected: false,
      assignedTo: [],
      workgroupId: '1',
    };

    const success = createLot(newLot);
    if (success) {
      console.log('Created a new lot.');
      navigation.goBack(); // Navigate back to the previous screen
    } else {
      console.error('Failure: no lot was created.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.label}>Lot Label</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter lot label"
        value={lotData.lotLabel}
        onChangeText={(text) => handleInputChange('lotLabel', text)}
      />
      {/* Repeat TextInput components for other fields like zoneLabel, neighbourhoodLabel, etc. */}
      <Button title="Create Lot" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 4,
    padding: 8,
    marginBottom: 16,
  },
});

export default LotCreationScreen;
