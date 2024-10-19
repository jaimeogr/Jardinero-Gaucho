// LotCreationScreen.tsx
import DateTimePicker from '@react-native-community/datetimepicker';
import { Picker } from '@react-native-picker/picker';
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

const { createLot, getNeighbourhoodsAndZones } = ControllerService;

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
  const { neighbourhoods } = getNeighbourhoodsAndZones();

  const [lotData, setLotData] = useState({
    lotLabel: '',
    neighbourhoodId: '',
    neighbourhoodLabel: '',
    zoneId: '',
    zoneLabel: '',
    lastMowingDate: new Date(),
    extraNotes: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showNeighbourhoodInput, setShowNeighbourhoodInput] = useState(false);
  const [showZoneInput, setShowZoneInput] = useState(false);

  const handleInputChange = (field: string, value: string | Date) => {
    setLotData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (
      !lotData.lotLabel ||
      !lotData.neighbourhoodLabel ||
      !lotData.zoneLabel
    ) {
      Alert.alert('Validation Error', 'Please fill in all required fields.');
      return;
    }

    // Generate new IDs if creating new neighbourhood or zone
    let neighbourhoodId = lotData.neighbourhoodId;
    if (!neighbourhoodId) {
      neighbourhoodId = uuidv4();
    }

    let zoneId = lotData.zoneId;
    if (!zoneId) {
      zoneId = uuidv4();
    }

    const newLot: LotInterface = {
      ...lotData,
      lotId: uuidv4(),
      neighbourhoodId,
      zoneId,
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
      {/* Lot Label Input */}
      <Text style={styles.label}>Casa</Text>
      <TextInput
        style={styles.input}
        placeholder="Ingresá la casa"
        value={lotData.lotLabel}
        onChangeText={(text) => handleInputChange('lotLabel', text)}
      />

      {/* Neighbourhood Picker/Input */}
      <Text style={styles.label}>Neighbourhood</Text>
      {showNeighbourhoodInput ? (
        <TextInput
          style={styles.input}
          placeholder="Enter new neighbourhood label"
          value={lotData.neighbourhoodLabel}
          onChangeText={(text) => handleInputChange('neighbourhoodLabel', text)}
        />
      ) : (
        <Picker
          selectedValue={lotData.neighbourhoodId}
          onValueChange={(itemValue) => {
            if (itemValue === 'add_new') {
              setShowNeighbourhoodInput(true);
              handleInputChange('neighbourhoodId', '');
              handleInputChange('neighbourhoodLabel', '');
            } else {
              const selectedNeighbourhood = neighbourhoods.find(
                (n) => n.neighbourhoodId === itemValue,
              );
              if (selectedNeighbourhood) {
                handleInputChange(
                  'neighbourhoodId',
                  selectedNeighbourhood.neighbourhoodId,
                );
                handleInputChange(
                  'neighbourhoodLabel',
                  selectedNeighbourhood.neighbourhoodLabel,
                );
                // Reset zone selection
                handleInputChange('zoneId', '');
                handleInputChange('zoneLabel', '');
                setShowZoneInput(false);
              }
            }
          }}
        >
          <Picker.Item label="Select Neighbourhood" value="" />
          {neighbourhoods.map((n) => (
            <Picker.Item
              key={n.neighbourhoodId}
              label={n.neighbourhoodLabel}
              value={n.neighbourhoodId}
            />
          ))}
          <Picker.Item label="Add New Neighbourhood..." value="add_new" />
        </Picker>
      )}

      {/* Zone Picker/Input */}
      {lotData.neighbourhoodId !== '' && !showNeighbourhoodInput && (
        <>
          <Text style={styles.label}>Zone</Text>
          {showZoneInput ? (
            <TextInput
              style={styles.input}
              placeholder="Enter new zone label"
              value={lotData.zoneLabel}
              onChangeText={(text) => handleInputChange('zoneLabel', text)}
            />
          ) : (
            <Picker
              selectedValue={lotData.zoneId}
              onValueChange={(itemValue) => {
                if (itemValue === 'add_new') {
                  setShowZoneInput(true);
                  handleInputChange('zoneId', '');
                  handleInputChange('zoneLabel', '');
                } else {
                  const selectedNeighbourhood = neighbourhoods.find(
                    (n) => n.neighbourhoodId === lotData.neighbourhoodId,
                  );
                  const selectedZone = selectedNeighbourhood?.zones.find(
                    (z) => z.zoneId === itemValue,
                  );
                  if (selectedZone) {
                    handleInputChange('zoneId', selectedZone.zoneId);
                    handleInputChange('zoneLabel', selectedZone.zoneLabel);
                  }
                }
              }}
            >
              <Picker.Item label="Select Zone" value="" />
              {neighbourhoods
                .find((n) => n.neighbourhoodId === lotData.neighbourhoodId)
                ?.zones.map((z) => (
                  <Picker.Item
                    key={z.zoneId}
                    label={z.zoneLabel}
                    value={z.zoneId}
                  />
                ))}
              <Picker.Item label="Add New Zone..." value="add_new" />
            </Picker>
          )}
        </>
      )}

      {/* Last Mowing Date - Date Picker */}
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

      {/* Extra Notes */}
      <Text style={styles.label}>Extra Notes</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Enter any extra notes"
        value={lotData.extraNotes}
        onChangeText={(text) => handleInputChange('extraNotes', text)}
        multiline
      />

      {/* Submit Button */}
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
