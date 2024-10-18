// LotCreationScreen.tsx
import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { v4 as uuidv4 } from 'uuid'; // ID Generator

import ControllerService from '../services/useControllerService'; // Correct import
import { LotInterface } from '../types/types';

type RootStackParamList = {
  LotCreation: undefined;
  // Other routes...
};

type LotCreationScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'LotCreation'
>;

type LotCreationScreenRouteProp = RouteProp<RootStackParamList, 'LotCreation'>;

interface Props {
  navigation: LotCreationScreenNavigationProp;
  route: LotCreationScreenRouteProp;
}

const LotCreationScreen: React.FC<Props> = ({ navigation }) => {
  const { createLot } = ControllerService;

  const [lotData, setLotData] = useState({
    lotLabel: '',
    zoneLabel: '',
    neighbourhoodLabel: '',
    lastMowingDate: new Date(),
    extraNotes: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleInputChange = (field: string, value: string | Date) => {
    setLotData({ ...lotData, [field]: value });
  };

  const handleSubmit = async () => {
    if (
      !lotData.lotLabel ||
      !lotData.zoneLabel ||
      !lotData.neighbourhoodLabel
    ) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    const newLot: LotInterface = {
      ...lotData,
      lotId: uuidv4(),
      zoneId: uuidv4(),
      neighbourhoodId: uuidv4(),
      lotIsSelected: false,
      assignedTo: [],
      workgroupId: '1',
      lastMowingDate: lotData.lastMowingDate || new Date(),
    };

    try {
      const success = createLot(newLot);
      if (success) {
        console.log('Created a new lot.');
        navigation.goBack();
      } else {
        console.error('Failure: no lot was created.');
      }
    } catch (error) {
      console.error('An error occurred while creating the lot:', error);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      handleInputChange('lastMowingDate', selectedDate);
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

      <Text style={styles.label}>Zone Label</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter zone label"
        value={lotData.zoneLabel}
        onChangeText={(text) => handleInputChange('zoneLabel', text)}
      />

      <Text style={styles.label}>Neighbourhood Label</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter neighbourhood label"
        value={lotData.neighbourhoodLabel}
        onChangeText={(text) => handleInputChange('neighbourhoodLabel', text)}
      />

      <Text style={styles.label}>Last Mowing Date</Text>
      <TouchableOpacity onPress={() => setShowDatePicker(true)}>
        <TextInput
          style={styles.input}
          placeholder="Select date"
          value={lotData.lastMowingDate.toDateString()}
          editable={false}
        />
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={lotData.lastMowingDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <Text style={styles.label}>Extra Notes</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Enter any extra notes"
        value={lotData.extraNotes}
        onChangeText={(text) => handleInputChange('extraNotes', text)}
        multiline
      />

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
