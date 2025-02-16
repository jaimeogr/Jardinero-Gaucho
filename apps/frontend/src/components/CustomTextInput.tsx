// CustomTextInput.tsx
import React from 'react';
import { Text, TextInput, View, StyleSheet, TextInputProps } from 'react-native';

import { theme } from '@/styles/styles';

interface InputTextProps extends TextInputProps {
  label: string; // Label for the input
  value: string; // Controlled value
  placeholder: string; // Placeholder text
  onChangeText: (text: string) => void; // Handler for text change
  isOptional?: boolean;
  multiline?: boolean;
  error?: string | null;
}

const CustomTextInput: React.FC<InputTextProps> = ({
  label,
  value,
  placeholder,
  onChangeText,
  isOptional = false,
  multiline = false,
  error = null,
  ...rest
}) => {
  return (
    <View style={styles.container}>
      {/* Label and Optional Indicator */}
      <View style={{ flexDirection: 'row', alignItems: 'baseline' }}>
        <Text style={[styles.label, isOptional && styles.labelIsOptional]}>{label}</Text>
        {isOptional && <Text style={styles.optionalInParentheses}>(opcional)</Text>}
      </View>
      {/* Input Field */}
      <TextInput
        style={[
          styles.input,
          multiline && styles.inputMultiline,
          isOptional && styles.inputIsOptional,
          error ? styles.inputError : null,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={theme.colors.placeholder}
        multiline={multiline}
        {...rest} // Pass other TextInputProps like keyboardType, maxLength, etc.
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 18,
  },
  label: {
    fontSize: 17,
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
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 16,
    height: 45,
  },
  inputMultiline: {
    height: 80,
    textAlignVertical: 'top', // Ensures text starts at the top for multiline inputs
  },
  inputIsOptional: {
    borderColor: theme.colors.input.optionalFieldBorder,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});

export default CustomTextInput;
