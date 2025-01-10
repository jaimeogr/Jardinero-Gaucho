import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { theme } from '../styles/styles';

interface ReadOnlyFieldProps {
  label: string; // Label for the field
  text: string | null; // The value to display
  placeholder?: string; // Placeholder text for when the value is empty
}

const ReadOnlyField: React.FC<ReadOnlyFieldProps> = ({ label, text, placeholder = '' }) => {
  return (
    <View style={styles.container}>
      {/* Label */}
      <Text style={styles.label}>{label}</Text>

      {/* Display Value or Placeholder. If there is no text, apply placeholder style*/}
      <Text style={[styles.text, !text && styles.placeholder]}>{text || placeholder}</Text>
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
  text: {
    fontSize: 17,
    paddingHorizontal: 10,
    backgroundColor: 'transparent',
  },
  placeholder: {
    color: theme.colors.placeholder,
  },
});

export default ReadOnlyField;
