// LotCreationScreen.tsx
import DateTimePicker from '@react-native-community/datetimepicker';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  Modal,
  Platform,
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { v4 as uuidv4 } from 'uuid'; // ID Generator

import ControllerService from '../services/useControllerService';
import { theme } from '../styles/styles';
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
  const { createLot, getNeighbourhoodsAndZones } = ControllerService;
  const { neighbourhoods } = getNeighbourhoodsAndZones();

  const [lotData, setLotData] = useState({
    lotLabel: '',
    neighbourhoodId: '',
    neighbourhoodLabel: '',
    zoneId: '',
    zoneLabel: '',
    lastMowingDate: null as Date | null,
    extraNotes: '',
  });

  const [showDatePicker, setShowDatePicker] = useState(false);

  const [showNeighbourhoodModal, setShowNeighbourhoodModal] = useState(false);
  const [newNeighbourhoodLabel, setNewNeighbourhoodLabel] = useState('');

  const [showZoneModal, setShowZoneModal] = useState(false);
  const [newZoneLabel, setNewZoneLabel] = useState('');

  const handleInputChange = (field: string, value: string | Date | null) => {
    setLotData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  const handleNeighbourhoodChange = (value: string) => {
    if (value === 'add_new') {
      setShowNeighbourhoodModal(true);
      // Clear current selection
      handleInputChange('neighbourhoodId', '');
      handleInputChange('neighbourhoodLabel', '');
    } else {
      const selectedNeighbourhood = neighbourhoods.find(
        (n) => n.neighbourhoodId === value,
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
        setNewZoneLabel('');
      }
    }
  };

  const handleZoneChange = (value: string) => {
    if (value === 'add_new') {
      setShowZoneModal(true);
      // Clear current selection
      handleInputChange('zoneId', '');
      handleInputChange('zoneLabel', '');
    } else {
      const selectedNeighbourhood = neighbourhoods.find(
        (n) => n.neighbourhoodId === lotData.neighbourhoodId,
      );
      const selectedZone = selectedNeighbourhood?.zones.find(
        (z) => z.zoneId === value,
      );
      if (selectedZone) {
        handleInputChange('zoneId', selectedZone.zoneId);
        handleInputChange('zoneLabel', selectedZone.zoneLabel);
      }
    }
  };

  const handleAddNeighbourhood = () => {
    if (newNeighbourhoodLabel.trim() === '') {
      Alert.alert('Validation Error', 'Please enter a neighbourhood label.');
      return;
    }
    const newNeighbourhoodId = uuidv4();
    handleInputChange('neighbourhoodId', newNeighbourhoodId);
    handleInputChange('neighbourhoodLabel', newNeighbourhoodLabel.trim());
    // Close modal
    setShowNeighbourhoodModal(false);
    setNewNeighbourhoodLabel('');
    // Reset zone selection
    handleInputChange('zoneId', '');
    handleInputChange('zoneLabel', '');
  };

  const handleAddZone = () => {
    if (newZoneLabel.trim() === '') {
      Alert.alert('Validation Error', 'Please enter a zone label.');
      return;
    }
    const newZoneId = uuidv4();
    handleInputChange('zoneId', newZoneId);
    handleInputChange('zoneLabel', newZoneLabel.trim());
    // Close modal
    setShowZoneModal(false);
    setNewZoneLabel('');
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
      lastMowingDate: lotData.lastMowingDate || undefined,
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
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (selectedDate) {
      handleInputChange('lastMowingDate', selectedDate);
    }
  };

  // Prepare picker items
  const neighbourhoodItems = neighbourhoods.map((n) => ({
    label: n.neighbourhoodLabel,
    value: n.neighbourhoodId,
  }));
  neighbourhoodItems.push({
    label: 'Agregar Nuevo Barrio...',
    value: 'add_new',
  });

  const selectedNeighbourhood = neighbourhoods.find(
    (n) => n.neighbourhoodId === lotData.neighbourhoodId,
  );
  const zoneItems = selectedNeighbourhood
    ? selectedNeighbourhood.zones.map((z) => ({
        label: z.zoneLabel,
        value: z.zoneId,
      }))
    : [];
  zoneItems.push({ label: 'Agregar Nueva Zona...', value: 'add_new' });

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
      <Text style={styles.label}>Barrio</Text>
      <View style={styles.pickerContainer}>
        <RNPickerSelect
          onValueChange={handleNeighbourhoodChange}
          items={neighbourhoodItems}
          value={lotData.neighbourhoodId}
          placeholder={{ label: 'Seleccionar Barrio', value: '' }}
          style={pickerSelectStyles}
          useNativeAndroidPickerStyle={false}
        />
      </View>

      {/* Zone Picker/Input */}
      {lotData.neighbourhoodId !== '' && (
        <>
          <Text style={styles.label}>Zona</Text>
          <View style={styles.pickerContainer}>
            <RNPickerSelect
              onValueChange={handleZoneChange}
              items={zoneItems}
              value={lotData.zoneId}
              placeholder={{ label: 'Seleccionar Zona', value: '' }}
              style={pickerSelectStyles}
              useNativeAndroidPickerStyle={false}
            />
          </View>
        </>
      )}

      {/* Last Mowing Date - Date Picker */}
      <Text style={styles.label}>Última Fecha de Corte de Pasto</Text>
      <TouchableOpacity
        onPress={() => setShowDatePicker(true)}
        style={styles.input}
      >
        <Text
          style={{
            color: lotData.lastMowingDate ? 'black' : '#aaa',
            fontSize: 16,
          }}
        >
          {lotData.lastMowingDate
            ? lotData.lastMowingDate.toDateString()
            : 'La última fecha de corte de pasto'}
        </Text>
      </TouchableOpacity>
      {showDatePicker && (
        <DateTimePicker
          value={lotData.lastMowingDate || new Date()}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      {/* Extra Notes */}
      <Text style={styles.label}>Notas Adicionales</Text>
      <TextInput
        style={[styles.input, { height: 80 }]}
        placeholder="Ingresá notas adicionales"
        value={lotData.extraNotes}
        onChangeText={(text) => handleInputChange('extraNotes', text)}
        multiline
      />

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Crear Lote</Text>
      </TouchableOpacity>

      {/* Neighbourhood Modal */}
      <Modal
        visible={showNeighbourhoodModal}
        transparent={true}
        animationType="slide"
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Agregar Nuevo Barrio</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresá el nombre del barrio"
              value={newNeighbourhoodLabel}
              onChangeText={setNewNeighbourhoodLabel}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowNeighbourhoodModal(false);
                  setNewNeighbourhoodLabel('');
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddNeighbourhood}
              >
                <Text style={styles.buttonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Zone Modal */}
      <Modal visible={showZoneModal} transparent={true} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Agregar Nueva Zona</Text>
            <TextInput
              style={styles.input}
              placeholder="Ingresá el nombre de la zona"
              value={newZoneLabel}
              onChangeText={setNewZoneLabel}
            />
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity
                style={styles.cancelButton}
                onPress={() => {
                  setShowZoneModal(false);
                  setNewZoneLabel('');
                }}
              >
                <Text style={styles.buttonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddZone}
              >
                <Text style={styles.buttonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
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
    borderColor: theme.colors.primary,
    borderRadius: 10,
    padding: 8,
    marginBottom: 16,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },
  submitButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 16,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  addButton: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  buttonText: {
    color: theme.colors.primary,
    fontSize: 16,
  },
});

// Custom styles for RNPickerSelect
const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'black',
    paddingRight: 30, // to ensure the text is not behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'black',
    paddingRight: 30,
  },
});

export default LotCreationScreen;
