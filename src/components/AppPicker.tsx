import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';

import { theme } from '../styles/styles';

interface AppPickerProps {
  label: string;
  value: string;
  items: Array<{ label: string; value: string }>;
  onValueChange: (value: string) => void;
  placeholder: string;
  isDisabled?: boolean;
}

const AppPicker: React.FC<AppPickerProps> = ({
  label,
  value,
  items,
  onValueChange,
  placeholder,
  isDisabled = false,
}) => {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.pickerContainer,
          isDisabled ? styles.disabledPickerContainer : {},
        ]}
      >
        <RNPickerSelect
          onValueChange={onValueChange}
          items={items}
          value={value}
          placeholder={{ label: placeholder, value: '' }}
          style={{
            ...pickerSelectStyles,
            inputAndroid: {
              ...pickerSelectStyles.inputAndroid,
              color: isDisabled ? '#6E6E6E' : 'black',
            },
            inputIOS: {
              ...pickerSelectStyles.inputIOS,
              color: isDisabled ? '#6E6E6E' : 'black',
            },
            placeholder: {
              color: '#6E6E6E',
            },
          }}
          useNativeAndroidPickerStyle={false}
          disabled={isDisabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
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
  },
  disabledPickerContainer: {
    backgroundColor: '#E0E0E0',
    borderColor: '#E0E0E0',
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

export default AppPicker;
