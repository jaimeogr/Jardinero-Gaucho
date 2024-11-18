// LotCreationScreen.tsx

import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
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
} from 'react-native';

import CustomDatePickerInput from '../components/CustomDatePickerInput';
import CustomSelectInput from '../components/CustomSelectInput';
import CustomTextInput from '../components/CustomTextInput';
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

const initialLotData = {
  lotLabel: '',
  neighbourhoodId: '',
  neighbourhoodLabel: '',
  zoneId: '',
  zoneLabel: '',
  lastMowingDate: null as Date | null,
  extraNotes: '',
};

const LotCreationScreen: React.FC<Props> = ({ navigation }) => {
  const {
    createLot,
    getNeighbourhoodsAndZones,
    addNeighbourhood,
    addZoneToNeighbourhood,
  } = ControllerService;
  const { neighbourhoods } = getNeighbourhoodsAndZones();

  const [lotData, setLotData] = useState(initialLotData);

  const [showNeighbourhoodModal, setShowNeighbourhoodModal] = useState(false);
  const [newNeighbourhoodLabel, setNewNeighbourhoodLabel] = useState('');

  const [showZoneModal, setShowZoneModal] = useState(false);
  const [newZoneLabel, setNewZoneLabel] = useState('');

  // Handle input changes
  const handleInputChange = (field: string, value: string | Date | null) => {
    setLotData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Handle neighbourhood selection
  const handleNeighbourhoodChange = (value: string) => {
    if (value === 'add_new') {
      setShowNeighbourhoodModal(true);
    } else if (value === '') {
      handleInputChange('neighbourhoodId', '');
      handleInputChange('neighbourhoodLabel', '');
      // Reset zone selection
      handleInputChange('zoneId', '');
      handleInputChange('zoneLabel', '');
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
      }
    }
  };

  // Handle zone selection
  const handleZoneChange = (value: string) => {
    if (value === 'add_new') {
      setShowZoneModal(true);
    } else if (value === '') {
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

  // Add new neighbourhood
  const handleAddNeighbourhood = () => {
    if (newNeighbourhoodLabel.trim() === '') {
      Alert.alert(
        'Problema con el texto ingresado',
        'El Barrio no puede estar vacio, al menos poner un numero. No seas Vago',
      );
      return;
    }

    const newNeighbourhood = addNeighbourhood(newNeighbourhoodLabel.trim());
    handleInputChange('neighbourhoodId', newNeighbourhood.neighbourhoodId);
    handleInputChange(
      'neighbourhoodLabel',
      newNeighbourhood.neighbourhoodLabel,
    );
    // Close modal
    setShowNeighbourhoodModal(false);
    setNewNeighbourhoodLabel('');
    // Reset zone selection
    handleInputChange('zoneId', '');
    handleInputChange('zoneLabel', '');
  };

  // Add new zone
  const handleAddZone = () => {
    if (newZoneLabel.trim() === '') {
      Alert.alert(
        'Problema con el texto ingresado',
        'La zona no puede estar vacia, al menos poner un numero. No seas Vago',
      );
      return;
    }

    const newZone = addZoneToNeighbourhood(
      lotData.neighbourhoodId,
      newZoneLabel.trim(),
    );
    handleInputChange('zoneId', newZone.zoneId);
    handleInputChange('zoneLabel', newZone.zoneLabel);
    // Close modal
    setShowZoneModal(false);
    setNewZoneLabel('');
  };

  // Clear selected date
  const clearDate = () => {
    handleInputChange('lastMowingDate', null);
  };

  // Submit lot and navigate back
  const handleSubmit = async (keepCreating: boolean) => {
    if (
      !lotData.lotLabel ||
      !lotData.neighbourhoodLabel ||
      !lotData.zoneLabel
    ) {
      Alert.alert(
        'Falta información.',
        'Es necesario que completes todos los campos.',
      );
      return;
    }
    const newLot: Partial<LotInterface> = {
      ...lotData,
      lotId: undefined,
      lotIsSelected: false,
      assignedTo: [],
      workgroupId: undefined,
      lastMowingDate: lotData.lastMowingDate || undefined,
    };
    try {
      const success = createLot(newLot);
      if (success) {
        console.log('Created a new lot.');
        // if the user wants to keep creating lots
        if (keepCreating) {
          setLotData(initialLotData);
        } else {
          navigation.goBack();
        }
      } else {
        console.error('Failure: no lot was created.');
      }
    } catch (error) {
      console.error('An error occurred while creating the lot:', error);
    }
  };

  // Cancel and navigate back
  const handleCancel = () => {
    navigation.goBack();
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
    <View style={styles.container}>
      <View style={styles.formContainer}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Neighbourhood Picker */}
          <CustomSelectInput
            label="Barrio"
            value={lotData.neighbourhoodId}
            items={neighbourhoodItems}
            onValueChange={(value) => {
              if (typeof value === 'string') {
                handleNeighbourhoodChange(value); // Handle only boolean values
              } else {
                console.warn('Invalid value type passed:', value); // Debugging fallback
              }
            }}
            placeholder="Seleccionar Barrio"
            isDisabled={false} // Neighbourhood picker is always enabled
          />

          {/* Zone Picker */}
          <CustomSelectInput
            label="Zona"
            value={lotData.zoneId}
            items={zoneItems}
            onValueChange={(value) => {
              if (typeof value === 'string') {
                handleZoneChange(value); // Handle only boolean values
              } else {
                console.warn('Invalid value type passed:', value); // Debugging fallback
              }
            }}
            placeholder={
              lotData.neighbourhoodId
                ? 'Seleccionar Zona'
                : 'Selecciona un barrio primero'
            }
            isDisabled={!lotData.neighbourhoodId} // Disable until neighbourhood is chosen
          />

          {/* Lot Label Input */}
          <CustomTextInput
            label="Casa"
            value={lotData.lotLabel}
            onChangeText={(text) => handleInputChange('lotLabel', text)}
            placeholder="Ingresá la casa"
          />

          {/* Last Mowing Date - Date Picker */}
          <CustomDatePickerInput
            label="Última Fecha de Corte de Pasto"
            value={lotData.lastMowingDate}
            onChange={(date) => handleInputChange('lastMowingDate', date)}
            trashAction={clearDate}
            isOptional={true}
          />

          {/* Extra Notes */}
          <CustomTextInput
            label="Notas Adicionales"
            value={lotData.extraNotes}
            onChangeText={(text) => handleInputChange('extraNotes', text)}
            placeholder="Ingresá notas adicionales.."
            isOptional={true}
            multiline={true}
          />
        </ScrollView>
        {/* Linear Gradient Effect */}
        <LinearGradient
          colors={['transparent', 'rgba(255, 255, 255, 0.9)']}
          style={styles.gradientOverlay}
          pointerEvents="none" // This ensures it doesn't block button touches
        />
      </View>

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
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowNeighbourhoodModal(false);
                  setNewNeighbourhoodLabel('');
                }}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalAddButton}
                onPress={handleAddNeighbourhood}
              >
                <Text style={styles.modalButtonText}>Agregar</Text>
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
                style={styles.modalCancelButton}
                onPress={() => {
                  setShowZoneModal(false);
                  setNewZoneLabel('');
                }}
              >
                <Text style={styles.modalButtonText}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalAddButton}
                onPress={handleAddZone}
              >
                <Text style={styles.modalButtonText}>Agregar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Buttons */}
      <View style={styles.buttonsContainer}>
        <View style={styles.buttonsCancelAndSubmit}>
          <TouchableOpacity
            style={[styles.button, styles.cancelButton, { flex: 6 }]}
            onPress={handleCancel}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, styles.submitButton, { flex: 6 }]}
            onPress={() => handleSubmit(false)}
          >
            <Text style={styles.submitButtonText}>Crear Lote</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={[styles.button, styles.nextLotButton]}
          onPress={() => handleSubmit(true)}
        >
          <Text style={styles.nextLotButtonText}>Crear Lote y Siguiente</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 16,
  },
  formContainer: {
    flex: 1,
    position: 'relative', // Allows the gradient to overlap the form
  },
  gradientOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 30, // Adjust height for the fading effect
    zIndex: 1, // Ensure it's above the scroll content
    elevation: 10, // Android layering
    marginRight: 4,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.input.requiredLabelText,
  },
  labelIsOptional: {
    color: theme.colors.input.optionalLabelText,
    fontWeight: 'normal',
  },
  optionalInParentheses: {
    fontSize: 15,
    color: theme.colors.input.optionalLabelText,
    fontStyle: 'italic',
    marginLeft: 4,
  },
  input: {
    borderWidth: 1.2,
    borderColor: theme.colors.input.requiredFieldBorder,
    borderRadius: 10,
    padding: 8,
    marginBottom: 18,
    height: 45,
    fontSize: 16,
  },
  inputIsOptional: {
    borderWidth: 1,
    borderColor: theme.colors.input.optionalFieldBorder,
  },
  placeholderText: {
    color: theme.colors.placeholder, // Reusable placeholder color
    fontSize: 16,
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
  modalCancelButton: {
    borderWidth: 1,
    borderColor: 'red',
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  modalAddButton: {
    borderWidth: 1,
    borderColor: theme.colors.primary,
    borderRadius: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  modalButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
  },
  buttonsContainer: {
    marginHorizontal: 6,
    marginTop: 12,
  },
  buttonsCancelAndSubmit: {
    flexDirection: 'row',
  },
  button: {
    borderRadius: 50,
    marginHorizontal: 8,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: 'white',

    // iOS shadow properties
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, // Position of the shadow
    shadowOpacity: 0.2, // Transparency of the shadow
    shadowRadius: 4, // Blurriness of the shadow

    // Android elevation
    elevation: 1, // Adjust this value as needed for more/less shadow depth
  },
  cancelButton: {
    borderWidth: 1.5,
    borderColor: '#707070',
  },
  cancelButtonText: {
    color: '#606060',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submitButton: {
    borderWidth: 1.5,
    borderColor: theme.colors.primary,
  },
  submitButtonText: {
    color: theme.colors.primary,
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextLotButton: {
    paddingVertical: 16,
    backgroundColor: theme.colors.primary,
    margin: 16,
  },
  nextLotButtonText: {
    color: '#fff',
    fontSize: 20,
    fontWeight: 'bold',
  },
});

export default LotCreationScreen;
