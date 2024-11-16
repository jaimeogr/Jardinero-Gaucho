import React from 'react';
import {
  Text,
  TextInput,
  View,
  StyleSheet,
  TextInputProps,
} from 'react-native';

import { theme } from '../styles/styles';

interface InputTextProps extends TextInputProps {
  label: string; // Label for the input
  value: string; // Controlled value
  onChangeText: (text: string) => void; // Handler for text change
  isOptional?: boolean; // Whether the input is optional
  multiline?: boolean; // Enable multiline input
  placeholder: string; // Placeholder text
}

const CustomTextInput: React.FC<InputTextProps> = ({
  label,
  value,
  onChangeText, // Updated to match TextInput's onChangeText
  isOptional = false,
  multiline = false,
  placeholder,
  ...rest
}) => {
  return (
    <View style={styles.container}>
      {/* Label and Optional Indicator */}
      <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
        <Text style={[styles.label, isOptional && styles.labelIsOptional]}>
          {label}
        </Text>
        {isOptional && (
          <Text style={styles.optionalInParentheses}>(opcional)</Text>
        )}
      </View>

      {/* Input Field */}
      <TextInput
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          isOptional && styles.inputIsOptional,
        ]}
        value={value}
        onChangeText={onChangeText} // Use onChangeText instead of onChange
        placeholder={placeholder}
        placeholderTextColor={theme.colors.placeholder}
        multiline={multiline}
        {...rest} // Pass other TextInputProps like keyboardType, maxLength, etc.
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
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
    fontSize: 16,
    height: 45,
  },
  inputIsOptional: {
    borderColor: theme.colors.input.optionalFieldBorder,
  },
  inputMultiline: {
    height: 80,
    textAlignVertical: 'top', // Ensures text starts at the top for multiline inputs
  },
});

export default CustomTextInput;
