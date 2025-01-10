import { MaterialCommunityIcons as Icon } from '@expo/vector-icons';
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import { theme } from '../styles/styles';

interface AppPickerProps {
  label?: string;
  value: string | boolean | null;
  items: Array<{ label: string; value: string | boolean }>;
  onValueChange: (value: string | boolean | null) => void;
  placeholder?: string;
  isDisabled?: boolean;
  customStyle?: any;
}

const CustomSelectInput: React.FC<AppPickerProps> = ({
  label = null,
  value,
  items,
  onValueChange,
  placeholder,
  isDisabled = false,
  customStyle = null,
}) => {
  return (
    <View style={customStyle}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.pickerContainer, isDisabled ? styles.disabledPickerContainer : {}]}>
        <RNPickerSelect
          onValueChange={onValueChange}
          items={items}
          value={value}
          placeholder={placeholder ? { label: placeholder, value: null } : {}} // placeholder is optional with this setup
          style={{
            ...pickerSelectStyles,
            inputAndroid: {
              ...pickerSelectStyles.inputAndroid,
              color: isDisabled ? theme.colors.placeholder : 'black',
            },
            inputIOS: {
              ...pickerSelectStyles.inputIOS,
              color: isDisabled ? theme.colors.placeholder : 'black',
            },
            placeholder: {
              color: theme.colors.placeholder,
            },
            iconContainer: styles.iconContainer,
          }}
          useNativeAndroidPickerStyle={false}
          disabled={isDisabled}
          Icon={() => (
            <Icon
              name="chevron-down" // Chevron icon
              size={26}
              color={isDisabled ? theme.colors.placeholder : theme.colors.primary}
            />
          )}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 17,
    fontWeight: 'bold',
    marginBottom: 8,
    color: theme.colors.input.requiredLabelText,
  },
  pickerContainer: {
    borderWidth: 1.2,
    borderColor: theme.colors.input.requiredFieldBorder,
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 18,
    paddingRight: 10, // Add padding inside the container
  },
  disabledPickerContainer: {
    backgroundColor: '#E0E0E0',
    borderColor: '#E0E0E0',
  },
  iconContainer: {
    justifyContent: 'center',
    height: '100%', // Full height to match input
  },
});

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    fontSize: 16,
    paddingVertical: 12,
    paddingHorizontal: 10,
    color: 'black',
    paddingRight: 30,
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    color: 'black',
    paddingRight: 30,
  },
  placeholder: {
    color: theme.colors.placeholder,
  },
});

export default CustomSelectInput;
